# GoHighLevel MCP Server

Servidor MCP (Model Context Protocol) para integração com a API do GoHighLevel, permitindo consultar informações da sua conta GHL através do Claude.

## Funcionalidades

Este servidor MCP oferece as seguintes ferramentas:

- **get_account_info**: Obter informações sobre sua conta e localização GHL
- **list_contacts**: Listar contatos com filtros opcionais
- **get_contact**: Obter detalhes de um contato específico
- **list_pipelines**: Listar todos os pipelines (funis de vendas)
- **list_opportunities**: Listar oportunidades (deals) dos pipelines
- **get_calendar_appointments**: Obter compromissos do calendário

## Pré-requisitos

- Node.js 18 ou superior
- Conta GoHighLevel com acesso à API
- API Key do GoHighLevel
- Location ID da sua conta GHL

## Como obter suas credenciais GHL

1. **API Key**:
   - Acesse sua conta GoHighLevel
   - Vá em Settings → Integrations → API Keys
   - Crie uma nova API Key ou use uma existente

2. **Location ID**:
   - Acesse sua conta GoHighLevel
   - O Location ID geralmente aparece na URL: `app.gohighlevel.com/location/{LOCATION_ID}`
   - Ou vá em Settings → Business Profile e copie o ID

## Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd claudecode
```

2. Instale as dependências:
```bash
npm install
```

3. Configure suas credenciais:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` e adicione suas credenciais:
```
GHL_API_KEY=sua_api_key_aqui
GHL_LOCATION_ID=seu_location_id_aqui
```

5. Compile o projeto:
```bash
npm run build
```

## Uso Local

### Com Claude Desktop

Adicione ao arquivo de configuração do Claude Desktop (`claude_desktop_config.json`):

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ghl": {
      "command": "node",
      "args": ["/caminho/completo/para/claudecode/build/index.js"],
      "env": {
        "GHL_API_KEY": "sua_api_key_aqui",
        "GHL_LOCATION_ID": "seu_location_id_aqui"
      }
    }
  }
}
```

Depois de configurar, reinicie o Claude Desktop.

### Teste via stdio

Você pode testar o servidor diretamente:

```bash
npm run dev
```

## Uso no Claude Web

Para usar este servidor MCP no Claude Web, você precisa hospedá-lo como um serviço HTTP. Aqui estão as opções:

### Opção 1: Deploy no Railway (Recomendado)

1. Crie uma conta no [Railway](https://railway.app)
2. Clique em "New Project" → "Deploy from GitHub repo"
3. Conecte este repositório
4. Configure as variáveis de ambiente:
   - `GHL_API_KEY`
   - `GHL_LOCATION_ID`
5. Railway irá gerar uma URL como: `https://seu-projeto.railway.app`

### Opção 2: Deploy no Render

1. Crie uma conta no [Render](https://render.com)
2. Crie um novo Web Service
3. Conecte o repositório GitHub
4. Configure as variáveis de ambiente
5. Render irá fornecer uma URL pública

### Opção 3: Ngrok (Desenvolvimento)

Para testes rápidos localmente:

```bash
# Terminal 1: Inicie o servidor
npm run dev

# Terminal 2: Exponha com ngrok
ngrok http 3000
```

Use a URL gerada pelo ngrok (ex: `https://abc123.ngrok.io`) no Claude Web.

### Configurar no Claude Web

Depois de obter sua URL pública:

1. Acesse [Claude.ai](https://claude.ai)
2. Vá em Settings → Integrations
3. Adicione um novo MCP Server:
   - Nome: GoHighLevel
   - URL: `sua-url-publica-aqui`

## Exemplos de Uso

Depois de configurado, você pode perguntar ao Claude:

- "Quais são meus contatos recentes no GoHighLevel?"
- "Mostre informações da minha conta GHL"
- "Liste os pipelines ativos"
- "Quais oportunidades eu tenho no pipeline de vendas?"
- "Mostre meus compromissos da próxima semana"

## Estrutura do Projeto

```
claudecode/
├── src/
│   └── index.ts          # Servidor MCP principal
├── build/                # Código compilado
├── .env                  # Configurações (não versionado)
├── .env.example          # Exemplo de configuração
├── package.json          # Dependências
├── tsconfig.json         # Configuração TypeScript
└── README.md            # Este arquivo
```

## Desenvolvimento

Para desenvolver com hot-reload:

```bash
npm run watch
```

## Troubleshooting

### Erro: "GHL_API_KEY environment variable is required"
- Verifique se o arquivo `.env` existe e contém a chave `GHL_API_KEY`

### Erro: "GHL_LOCATION_ID is not configured"
- Adicione o `GHL_LOCATION_ID` no arquivo `.env`

### Erro de autenticação (401)
- Verifique se sua API Key está correta e ativa
- Confirme se a API Key tem as permissões necessárias

### Erro de conexão
- Verifique sua conexão com internet
- Confirme se a API do GoHighLevel está acessível

## Segurança

- **NUNCA** compartilhe seu arquivo `.env` ou faça commit dele no git
- Mantenha suas API Keys seguras
- Use variáveis de ambiente em produção
- Considere usar rotação de chaves periodicamente

## Licença

MIT

## Suporte

Para problemas ou sugestões, abra uma issue no repositório.
