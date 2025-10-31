# Deploy para Claude Web - Guia Completo

Para usar este servidor MCP no Claude Web, você precisa hospedá-lo como um serviço acessível via HTTP. Aqui está o guia passo a passo:

## Opção 1: Railway (Mais Fácil - Recomendado)

### Passo 1: Criar conta no Railway
1. Acesse https://railway.app
2. Clique em "Login with GitHub"
3. Autorize o Railway a acessar seu GitHub

### Passo 2: Fazer Deploy
1. No Railway, clique em "New Project"
2. Selecione "Deploy from GitHub repo"
3. Escolha o repositório `remborba/claudecode`
4. Selecione o branch `claude/create-ghl-mcp-server-011CUfvetSgyNuQxHKpMVchK`

### Passo 3: Configurar Variáveis de Ambiente
1. No projeto criado, vá em "Variables"
2. Adicione as variáveis:
   - `GHL_API_KEY` = `pit-b98a827a-d155-49b8-a5b1-f63a77ab9891`
   - `GHL_LOCATION_ID` = `WpYVPwntuG1zBWk68WC8`
3. Clique em "Deploy" (o Railway fará o deploy automaticamente)

### Passo 4: Obter a URL
1. Vá em "Settings" do seu serviço
2. Em "Networking", clique em "Generate Domain"
3. Railway gerará uma URL como: `https://seu-projeto.up.railway.app`
4. Copie esta URL!

### Passo 5: Configurar no Claude Web
1. Acesse https://claude.ai
2. Vá em Settings (⚙️)
3. Procure por "Integrations" ou "MCP Servers"
4. Clique em "Add MCP Server"
5. Cole a URL do Railway
6. Pronto! O Claude Web poderá acessar sua conta GHL

---

## Opção 2: Render (Alternativa Gratuita)

### Passo 1: Criar conta no Render
1. Acesse https://render.com
2. Faça login com GitHub

### Passo 2: Criar Web Service
1. No dashboard, clique em "New +"
2. Selecione "Web Service"
3. Conecte o repositório `remborba/claudecode`
4. Configure:
   - **Name**: ghl-mcp-server
   - **Branch**: `claude/create-ghl-mcp-server-011CUfvetSgyNuQxHKpMVchK`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node build/index.js`

### Passo 3: Configurar Variáveis
1. Em "Environment", adicione:
   - `GHL_API_KEY` = `pit-b98a827a-d155-49b8-a5b1-f63a77ab9891`
   - `GHL_LOCATION_ID` = `WpYVPwntuG1zBWk68WC8`

### Passo 4: Deploy
1. Clique em "Create Web Service"
2. Aguarde o deploy (pode levar alguns minutos)
3. Render fornecerá uma URL como: `https://ghl-mcp-server.onrender.com`

### Passo 5: Configurar no Claude Web
Igual ao Passo 5 da Opção 1

---

## Opção 3: Ngrok (Apenas para Testes)

**⚠️ ATENÇÃO**: Esta opção é apenas para testes temporários. A URL muda toda vez que você reinicia.

### Passos:
1. Instale o ngrok: https://ngrok.com/download
2. Inicie o servidor localmente:
   ```bash
   cd /home/user/claudecode
   node build/index.js
   ```
3. Em outro terminal, execute:
   ```bash
   ngrok http 3000
   ```
4. Copie a URL gerada (ex: `https://abc123.ngrok.io`)
5. Use esta URL no Claude Web

**Desvantagens**:
- URL temporária (muda ao reiniciar)
- Precisa manter o computador ligado
- Ngrok gratuito tem limites de conexões

---

## Verificar se está funcionando

Depois do deploy, você pode testar visitando a URL no navegador. Se ver algo como:

```
GoHighLevel MCP Server running on stdio
```

Significa que está funcionando! ✅

---

## Próximos Passos

Após escolher uma opção e fazer o deploy:

1. ✅ Copie a URL gerada
2. ✅ Configure no Claude Web
3. ✅ Comece a usar perguntando: "Liste meus contatos do GoHighLevel"

## Suporte

Se tiver problemas:
- Verifique se as variáveis de ambiente estão corretas
- Confirme se a API Key do GHL está ativa
- Verifique os logs do serviço de deploy (Railway/Render)
