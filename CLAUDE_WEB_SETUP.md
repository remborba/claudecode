# 🌐 Configuração para Claude Web - Guia Completo

## ✅ Servidor MCP Atualizado

O servidor agora implementa o **protocolo MCP completo sobre HTTP** com JSON-RPC 2.0, permitindo conexão direta com o Claude Web.

---

## 📋 Pré-requisitos

1. ✅ Servidor deployado no Railway (ou outro host)
2. ✅ URL pública funcionando (ex: `https://seu-projeto.up.railway.app`)
3. ✅ Variáveis de ambiente configuradas:
   - `GHL_API_KEY`
   - `GHL_LOCATION_ID`

---

## 🔗 Configurar no Claude Web

### Passo 1: Obter sua URL do Railway

Se ainda não tem:
1. Acesse https://railway.app
2. Abra seu projeto GHL MCP
3. Vá em **Settings** → **Networking**
4. Clique em **"Generate Domain"**
5. Digite porta: **3000**
6. Copie a URL gerada (ex: `https://ghl-mcp-server-production.up.railway.app`)

### Passo 2: Testar a URL

Abra no navegador: `https://sua-url.railway.app`

Você deve ver:
```json
{
  "status": "ok",
  "service": "GoHighLevel MCP Server",
  "version": "1.0.0",
  "protocol": "MCP over HTTP",
  "endpoints": {
    "mcp": "POST /mcp",
    "sse": "GET /sse"
  }
}
```

✅ Se viu isso, o servidor está funcionando!

### Passo 3: Testar o Protocolo MCP

Teste o endpoint MCP:
```bash
curl -X POST https://sua-url.railway.app/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}'
```

Resposta esperada:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "tools": {}
    },
    "serverInfo": {
      "name": "ghl-mcp-server",
      "version": "1.0.0"
    }
  }
}
```

✅ Se recebeu essa resposta, o protocolo MCP está funcionando!

---

## 🎯 Conectar no Claude Web

### URL para usar no Claude Web:

```
https://sua-url.railway.app/mcp
```

**Importante**: Use o endpoint `/mcp`, não apenas a URL base!

### Como adicionar (quando disponível):

1. Acesse https://claude.ai
2. Vá em **Settings** ⚙️
3. Procure **"Integrations"** ou **"MCP Servers"** ou **"Extensions"**
4. Clique em **"Add Server"** ou **"Connect"**
5. Cole a URL: `https://sua-url.railway.app/mcp`
6. Salve/Conecte

---

## ⚠️ Se não encontrar opção de MCP no Claude Web

O Claude Web pode ainda não ter interface visual para adicionar servidores MCP. Neste caso:

### Opção A: Aguarde o recurso
A Anthropic pode lançar o suporte em breve. Seu servidor já está pronto!

### Opção B: Use via API
Integre diretamente via API do Claude com ferramenta externa:

```javascript
// Exemplo: Fazer requisição MCP
const response = await fetch('https://sua-url.railway.app/mcp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'list_contacts',
      arguments: { limit: 10 }
    }
  })
});
```

### Opção C: Use Claude Desktop
O Claude Desktop já suporta MCP completamente via stdio (veja `CLAUDE_DESKTOP_SETUP.md`)

---

## 🔐 Autenticação

O servidor atual **não requer autenticação adicional** porque:
- A autenticação com GoHighLevel é feita via variáveis de ambiente no servidor
- O servidor é público mas apenas expõe dados da SUA conta configurada
- As credenciais GHL nunca são expostas

### Para adicionar autenticação (opcional):

Se quiser proteger o servidor com API key:

1. Adicione uma variável de ambiente `MCP_API_KEY` no Railway
2. Envie header `Authorization: Bearer sua-chave` nas requisições
3. Valide no servidor antes de processar

---

## 🧪 Testando o Servidor

### Teste 1: Health Check
```bash
curl https://sua-url.railway.app/
```

### Teste 2: Inicializar MCP
```bash
curl -X POST https://sua-url.railway.app/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}'
```

### Teste 3: Listar Ferramentas
```bash
curl -X POST https://sua-url.railway.app/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'
```

### Teste 4: Chamar Ferramenta (Listar Contatos)
```bash
curl -X POST https://sua-url.railway.app/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":3,
    "method":"tools/call",
    "params":{
      "name":"list_contacts",
      "arguments":{"limit":5}
    }
  }'
```

---

## 📊 Endpoints Disponíveis

### Protocolo MCP (JSON-RPC 2.0)

**Endpoint**: `POST /mcp`

**Métodos suportados**:
- `initialize` - Inicializar conexão MCP
- `tools/list` - Listar todas as ferramentas
- `tools/call` - Chamar uma ferramenta específica
- `ping` - Verificar conexão

### SSE (Server-Sent Events)

**Endpoint**: `GET /sse`

Conexão para atualizações em tempo real (opcional)

### Endpoints REST (Legacy)

Para compatibilidade:
- `GET /` - Health check
- `GET /tools` - Listar ferramentas (REST)
- `GET /account` - Informações da conta
- `GET /contacts` - Listar contatos

---

## 🔍 Troubleshooting

### Erro: "Cannot connect to MCP server"
- ✅ Verifique se a URL está correta
- ✅ Use `/mcp` no final da URL
- ✅ Teste o endpoint manualmente com curl
- ✅ Verifique logs no Railway (aba Deployments)

### Erro: "Authentication failed"
- ✅ Verifique se `GHL_API_KEY` está configurada
- ✅ Verifique se `GHL_LOCATION_ID` está configurada
- ✅ Teste os endpoints REST para validar credenciais

### Erro: "GHL_LOCATION_ID is not configured"
- ✅ Adicione a variável no Railway
- ✅ Redeploy do serviço após adicionar
- ✅ Verifique se o nome está correto (não pode ter espaços)

### Servidor não responde
- ✅ Verifique se o deploy foi bem-sucedido (status "Success")
- ✅ Verifique os logs do Railway
- ✅ Confirme que a porta 3000 está configurada
- ✅ Tente acessar a URL base primeiro

---

## 📚 Recursos Adicionais

- **Protocolo MCP**: https://modelcontextprotocol.io/
- **Railway Docs**: https://docs.railway.app/
- **GoHighLevel API**: https://highlevel.stoplight.io/

---

## ✅ Checklist Final

- [ ] Servidor deployado no Railway
- [ ] URL pública funcionando
- [ ] Health check retorna "ok"
- [ ] Endpoint `/mcp` responde a JSON-RPC
- [ ] Método `initialize` funciona
- [ ] Método `tools/list` retorna 6 ferramentas
- [ ] Método `tools/call` executa corretamente
- [ ] Pronto para conectar no Claude Web!

---

## 💡 Status do Claude Web

**Nota**: Em outubro/novembro de 2024, o Claude Web pode ainda não ter interface visual para adicionar servidores MCP. Se não encontrar a opção:

1. ✅ Seu servidor está pronto e funcionando
2. ✅ Use Claude Desktop (já funciona perfeitamente)
3. ✅ Aguarde atualização do Claude Web
4. ✅ Ou integre via API diretamente

**Seu projeto está 100% funcional e preparado para quando o Claude Web lançar o suporte completo!** 🚀
