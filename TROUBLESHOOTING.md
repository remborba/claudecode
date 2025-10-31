# 🔍 Diagnóstico: URL Railway com Erro 403

## ⚠️ Problema Identificado

Sua URL `https://claudecode-production.up.railway.app/` está retornando **403 Forbidden**.

Isso pode ter várias causas. Vamos resolver:

---

## 📋 Checklist de Diagnóstico

### 1. Verificar se o serviço está rodando

No Railway:
1. Vá no seu projeto
2. Clique no serviço GHL MCP
3. Verifique a aba **"Deployments"**
4. O último deploy está com status **"Success" ✅** (verde)?

❌ Se estiver "Failed" (vermelho):
- Clique no deploy para ver os logs
- Procure por mensagens de erro
- O erro mais comum: variáveis de ambiente faltando

✅ Se estiver "Success":
- Vá para o passo 2

---

### 2. Verificar Logs do Servidor

No Railway:
1. Clique no serviço
2. Vá na aba **"Logs"** ou **"Observability"**
3. Você deve ver algo como:
   ```
   GoHighLevel MCP HTTP Server running on port 3000
   MCP endpoint: http://localhost:3000/mcp
   SSE endpoint: http://localhost:3000/sse
   ```

❌ Se não ver essas mensagens:
- O servidor não iniciou corretamente
- Veja o passo 3

✅ Se ver essas mensagens:
- O servidor está rodando! Veja o passo 4

---

### 3. Verificar Variáveis de Ambiente

No Railway:
1. Vá em **"Variables"**
2. Confirme que existem:
   - ✅ `GHL_API_KEY` = `pit-b98a827a-d155-49b8-a5b1-f63a77ab9891`
   - ✅ `GHL_LOCATION_ID` = `WpYVPwntuG1zBWk68WC8`
   - ✅ `PORT` (Railway adiciona automaticamente - não precisa adicionar)

❌ Se alguma estiver faltando:
1. Adicione a variável
2. Clique em "Deploy" ou aguarde redeploy automático
3. Aguarde 2-3 minutos
4. Tente acessar a URL novamente

---

### 4. Verificar Configuração de Rede

No Railway:
1. Vá em **"Settings"**
2. Procure por **"Networking"** ou **"Public Networking"**
3. Confirme:
   - ✅ Domain está gerado: `claudecode-production.up.railway.app`
   - ✅ Porta configurada: `3000` (ou AUTO)

Se a porta não estiver configurada:
1. Em "Networking", procure o campo de porta
2. Digite `3000`
3. Salve
4. Aguarde 1-2 minutos

---

### 5. Testar Diretamente no Navegador

Abra estas URLs no seu navegador (não no terminal):

**Teste 1**: Health check
```
https://claudecode-production.up.railway.app/
```

**Teste 2**: Endpoint MCP
```
https://claudecode-production.up.railway.app/mcp
```

**O que você vê?**

A) **Página em branco ou erro genérico** → Servidor não está respondendo
B) **JSON com "status":"ok"** → Servidor funcionando! ✅
C) **403 Forbidden** → Problema de configuração ou Railway
D) **Cannot GET /mcp** → Normal para GET em endpoint POST

---

### 6. Possíveis Causas do 403

#### Causa A: Railway Proxy/WAF
O Railway pode ter um firewall bloqueando certas requisições.

**Solução**:
- Geralmente resolve sozinho após alguns minutos
- Tente acessar de outro navegador/rede
- Verifique se o domínio foi gerado recentemente (pode levar alguns minutos para propagar)

#### Causa B: Servidor não está escutando na porta correta
O Railway fornece a porta via variável `PORT`.

**Verificar no código** (já implementado):
```typescript
const PORT = process.env.PORT || 3000;
```
✅ Isso já está correto no código

#### Causa C: Build falhou
O TypeScript pode não ter compilado corretamente.

**Verificar**:
1. Vá em "Deployments"
2. Clique no último deploy
3. Veja se a fase de "Build" foi bem-sucedida
4. Procure por erros de compilação TypeScript

---

## 🔧 Solução Rápida: Redeploy

Se nada funcionar, force um redeploy:

### Opção 1: Pelo Railway UI
1. Vá em "Deployments"
2. Clique nos 3 pontinhos (...) do último deploy
3. Clique em "Redeploy"
4. Aguarde 2-3 minutos

### Opção 2: Pelo Git (fazer um pequeno commit)
```bash
# Faça uma pequena alteração
echo "" >> README.md
git add README.md
git commit -m "Trigger redeploy"
git push
```

Railway detectará e fará redeploy automático.

---

## 🧪 Teste Manual do Protocolo MCP

Depois que o servidor estiver acessível, teste com curl:

```bash
# Teste 1: Health Check
curl https://claudecode-production.up.railway.app/

# Teste 2: Initialize MCP
curl -X POST https://claudecode-production.up.railway.app/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}'

# Teste 3: List Tools
curl -X POST https://claudecode-production.up.railway.app/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'
```

---

## ⚠️ Importante sobre Claude Web

**Mesmo com o servidor funcionando perfeitamente**, o Claude Web pode **ainda não suportar servidores MCP externos**.

### Por quê?

O MCP (Model Context Protocol) foi lançado recentemente pela Anthropic. Atualmente:

- ✅ **Claude Desktop**: Suporte completo via stdio
- ❓ **Claude Web**: Pode não ter interface para adicionar servidores externos ainda

### O que isso significa?

Se você não encontrar onde adicionar o servidor no Claude Web, é porque:
1. O recurso ainda não foi lançado publicamente
2. Está em beta fechado
3. Será lançado em breve

---

## ✅ Enquanto isso, você pode:

### 1. Usar Claude Desktop (Funciona 100%)
Veja: `CLAUDE_DESKTOP_SETUP.md`

### 2. Usar a API diretamente
Integre o endpoint `/mcp` em suas aplicações:

```javascript
const response = await fetch('https://claudecode-production.up.railway.app/mcp', {
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

const data = await response.json();
console.log(data.result);
```

### 3. Aguardar Claude Web lançar o suporte
Seu servidor já está **100% pronto** para quando o suporte for lançado!

---

## 📞 Próximo Passo

**Me diga:**

1. Quando você abre `https://claudecode-production.up.railway.app/` no navegador, o que aparece?
2. Você consegue ver os logs no Railway? O que está escrito lá?
3. O último deploy está com status "Success" (verde)?

Com essas informações consigo te ajudar melhor! 🚀
