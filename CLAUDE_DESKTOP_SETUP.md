# Configuração para Claude Desktop

Cole esta configuração no arquivo de configuração do Claude Desktop:

## Localização do arquivo:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

## Configuração:

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

## Passos:

1. Abra o arquivo `claude_desktop_config.json` (crie se não existir)
2. Cole a configuração acima
3. Salve o arquivo
4. Reinicie o Claude Desktop
5. O servidor GHL estará disponível automaticamente!

## Como usar:

Depois de configurado, você pode perguntar ao Claude Desktop coisas como:

- "Liste meus contatos do GoHighLevel"
- "Mostre informações da minha conta GHL"
- "Quais são meus pipelines ativos?"
- "Mostre as oportunidades do meu funil de vendas"
- "Quais são meus compromissos desta semana?"

O Claude Desktop terá acesso direto aos dados da sua conta GHL através do MCP!
