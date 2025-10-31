# 🚀 Guia Rápido - MCP GoHighLevel

Seu servidor MCP está **pronto e configurado**! ✅

## 📊 Suas Credenciais
- ✅ API Key: Configurada
- ✅ Location ID: Configurada
- ✅ Servidor testado e funcionando

## 🎯 Próximos Passos

### Para usar no **Claude Desktop**:

1. Abra o arquivo de configuração:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. Cole esta configuração:
```json
{
  "mcpServers": {
    "ghl": {
      "command": "node",
      "args": ["/home/user/claudecode/build/index.js"],
      "env": {
        "GHL_API_KEY": "pit-b98a827a-d155-49b8-a5b1-f63a77ab9891",
        "GHL_LOCATION_ID": "WpYVPwntuG1zBWk68WC8"
      }
    }
  }
}
```

3. Reinicie o Claude Desktop
4. Pronto! Pergunte: *"Liste meus contatos do GoHighLevel"*

📖 **Detalhes completos**: Veja `CLAUDE_DESKTOP_SETUP.md`

---

### Para usar no **Claude Web**:

Você precisa fazer deploy do servidor. Escolha uma opção:

#### 🏆 Opção 1: Railway (Recomendado - Mais Fácil)
1. Acesse: https://railway.app
2. Login com GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Escolha: `remborba/claudecode` (branch `claude/create-ghl-mcp-server-011CUfvetSgyNuQxHKpMVchK`)
5. Adicione as variáveis de ambiente:
   - `GHL_API_KEY`: `pit-b98a827a-d155-49b8-a5b1-f63a77ab9891`
   - `GHL_LOCATION_ID`: `WpYVPwntuG1zBWk68WC8`
6. Deploy automático!
7. Copie a URL gerada (ex: `https://seu-projeto.up.railway.app`)
8. Configure no Claude Web → Settings → Integrations

#### 🔧 Opção 2: Render (Alternativa)
Similar ao Railway, mas usa https://render.com

#### ⚡ Opção 3: Ngrok (Apenas Testes)
- Mais rápido para testar
- URL temporária
- Precisa manter o PC ligado

📖 **Guia passo a passo completo**: Veja `CLAUDE_WEB_DEPLOYMENT.md`

---

## 🛠️ O que você pode fazer?

Depois de configurado, pergunte ao Claude:

- ✅ "Mostre informações da minha conta GoHighLevel"
- ✅ "Liste meus últimos 20 contatos"
- ✅ "Busque contatos com o nome João"
- ✅ "Quais são meus pipelines de vendas?"
- ✅ "Mostre as oportunidades do pipeline X"
- ✅ "Quais são meus compromissos desta semana?"

## 📁 Arquivos Importantes

- `CLAUDE_DESKTOP_SETUP.md` - Configuração detalhada para Claude Desktop
- `CLAUDE_WEB_DEPLOYMENT.md` - Guia completo de deploy para Claude Web
- `README.md` - Documentação técnica completa
- `.env` - Suas credenciais (já configurado)

## 🔒 Segurança

⚠️ Importante:
- Nunca compartilhe seu arquivo `.env`
- Nunca faça commit do `.env` no Git (já está no `.gitignore`)
- Suas credenciais são privadas

## 🆘 Precisa de Ajuda?

- Leia os arquivos de documentação detalhados
- Verifique se as credenciais estão corretas
- Confirme se a API Key está ativa no GoHighLevel

---

**Status**: ✅ Tudo configurado e pronto para usar!
