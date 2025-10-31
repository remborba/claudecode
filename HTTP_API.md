# GoHighLevel MCP - HTTP API

Este servidor oferece duas formas de uso:
1. **Stdio** - Para Claude Desktop (comunicação direta via stdin/stdout)
2. **HTTP REST API** - Para Claude Web e integrações web (este documento)

## 🌐 Servidor HTTP

O servidor HTTP expõe endpoints REST para acessar os dados do GoHighLevel.

### Base URL
Após deploy no Railway: `https://seu-projeto.up.railway.app`

### Porta
O servidor escuta na porta definida pela variável de ambiente `PORT`, ou porta 3000 por padrão.

---

## 📋 Endpoints Disponíveis

### 1. Health Check
```http
GET /
```

**Resposta:**
```json
{
  "status": "ok",
  "service": "GoHighLevel MCP Server",
  "version": "1.0.0",
  "endpoints": {
    "health": "GET /",
    "tools": "GET /tools",
    "accountInfo": "GET /account",
    "contacts": "GET /contacts",
    "contact": "GET /contacts/:id",
    "pipelines": "GET /pipelines",
    "opportunities": "GET /opportunities",
    "appointments": "GET /appointments"
  }
}
```

---

### 2. Listar Ferramentas
```http
GET /tools
```

Retorna todas as ferramentas disponíveis no servidor MCP.

**Resposta:**
```json
{
  "tools": [
    {
      "name": "get_account_info",
      "description": "Get information about your GoHighLevel account and location"
    },
    {
      "name": "list_contacts",
      "description": "List contacts from your GoHighLevel account with optional filtering",
      "parameters": ["limit", "query"]
    },
    ...
  ]
}
```

---

### 3. Informações da Conta
```http
GET /account
```

Retorna informações sobre sua conta e localização do GoHighLevel.

**Resposta:**
```json
{
  "location": {
    "id": "WpYVPwntuG1zBWk68WC8",
    "name": "...",
    "address": "...",
    ...
  }
}
```

---

### 4. Listar Contatos
```http
GET /contacts?limit=10&query=nome
```

**Parâmetros de Query:**
- `limit` (opcional): Número máximo de contatos (padrão: 10, máximo: 100)
- `query` (opcional): Buscar por nome, email ou telefone

**Exemplo:**
```bash
curl "https://seu-servidor.railway.app/contacts?limit=20&query=João"
```

**Resposta:**
```json
{
  "contacts": [
    {
      "id": "...",
      "firstName": "João",
      "lastName": "Silva",
      "email": "joao@example.com",
      "phone": "+5511999999999",
      ...
    }
  ]
}
```

---

### 5. Obter Contato Específico
```http
GET /contacts/:id
```

**Exemplo:**
```bash
curl "https://seu-servidor.railway.app/contacts/abc123"
```

**Resposta:**
```json
{
  "contact": {
    "id": "abc123",
    "firstName": "João",
    "lastName": "Silva",
    "email": "joao@example.com",
    ...
  }
}
```

---

### 6. Listar Pipelines
```http
GET /pipelines
```

Retorna todos os pipelines (funis de vendas) da sua conta.

**Resposta:**
```json
{
  "pipelines": [
    {
      "id": "pipeline123",
      "name": "Vendas Principal",
      "stages": [...]
    }
  ]
}
```

---

### 7. Listar Oportunidades
```http
GET /opportunities?pipelineId=xyz&limit=10
```

**Parâmetros de Query:**
- `pipelineId` (opcional): Filtrar por pipeline específico
- `limit` (opcional): Número máximo de oportunidades (padrão: 10)

**Exemplo:**
```bash
curl "https://seu-servidor.railway.app/opportunities?limit=20"
```

**Resposta:**
```json
{
  "opportunities": [
    {
      "id": "opp123",
      "name": "Deal com Cliente X",
      "value": 5000,
      "status": "open",
      ...
    }
  ]
}
```

---

### 8. Obter Compromissos
```http
GET /appointments?startDate=2024-01-01&endDate=2024-12-31
```

**Parâmetros de Query:**
- `startDate` (opcional): Data inicial (formato ISO: YYYY-MM-DD)
- `endDate` (opcional): Data final (formato ISO: YYYY-MM-DD)

**Exemplo:**
```bash
curl "https://seu-servidor.railway.app/appointments?startDate=2024-11-01&endDate=2024-11-30"
```

**Resposta:**
```json
{
  "appointments": [
    {
      "id": "apt123",
      "title": "Reunião com Cliente",
      "startTime": "2024-11-15T14:00:00Z",
      "endTime": "2024-11-15T15:00:00Z",
      ...
    }
  ]
}
```

---

## 🔐 Autenticação

A autenticação com o GoHighLevel é feita automaticamente usando as variáveis de ambiente configuradas no servidor:
- `GHL_API_KEY`: Sua chave da API
- `GHL_LOCATION_ID`: ID da sua localização

Não é necessário passar credenciais nas requisições HTTP.

---

## ⚠️ Tratamento de Erros

### Erros Comuns

**400 - Bad Request**
```json
{
  "error": "GHL_LOCATION_ID is not configured"
}
```

**401 - Unauthorized**
```json
{
  "error": "Invalid API key"
}
```

**404 - Not Found**
```json
{
  "error": "Contact not found"
}
```

**500 - Internal Server Error**
```json
{
  "error": "Internal server error message"
}
```

---

## 🧪 Testando Localmente

```bash
# Iniciar o servidor
npm start

# Testar o health check
curl http://localhost:3000/

# Testar listagem de contatos
curl http://localhost:3000/contacts?limit=5
```

---

## 🚀 Deploy

### Railway
1. O servidor detecta automaticamente a variável `PORT` fornecida pelo Railway
2. Digite **3000** quando o Railway perguntar sobre a porta
3. Acesse sua URL gerada: `https://seu-projeto.railway.app`

### Render
1. Configure o Start Command: `npm start`
2. O Render fornecerá a variável PORT automaticamente

---

## 📝 Notas

- Todos os endpoints retornam JSON
- As respostas seguem o formato da API do GoHighLevel
- O servidor inclui CORS habilitado para permitir chamadas de navegadores
- Rate limits dependem da sua conta GoHighLevel

---

## 🔗 Links Úteis

- [Documentação da API GoHighLevel](https://highlevel.stoplight.io/)
- [Railway Documentation](https://docs.railway.app/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
