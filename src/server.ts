import express, { Request, Response } from 'express';
import cors from 'cors';
import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_API_URL = process.env.GHL_API_URL || 'https://rest.gohighlevel.com/v1';

if (!GHL_API_KEY) {
  console.error('Error: GHL_API_KEY environment variable is required');
  process.exit(1);
}

// Create axios instance for GHL API
const ghlApi: AxiosInstance = axios.create({
  baseURL: GHL_API_URL,
  headers: {
    'Authorization': `Bearer ${GHL_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// MCP Tool definitions
const MCP_TOOLS = [
  {
    name: 'get_account_info',
    description: 'Get information about your GoHighLevel account and location',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'list_contacts',
    description: 'List contacts from your GoHighLevel account with optional filtering',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Maximum number of contacts to return (default: 10, max: 100)',
          default: 10,
        },
        query: {
          type: 'string',
          description: 'Search query to filter contacts by name, email, or phone',
        },
      },
    },
  },
  {
    name: 'get_contact',
    description: 'Get detailed information about a specific contact',
    inputSchema: {
      type: 'object',
      properties: {
        contactId: {
          type: 'string',
          description: 'The ID of the contact to retrieve',
        },
      },
      required: ['contactId'],
    },
  },
  {
    name: 'list_pipelines',
    description: 'List all pipelines (sales funnels) in your GoHighLevel account',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'list_opportunities',
    description: 'List opportunities (deals) from your pipelines',
    inputSchema: {
      type: 'object',
      properties: {
        pipelineId: {
          type: 'string',
          description: 'Filter opportunities by pipeline ID',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of opportunities to return (default: 10)',
          default: 10,
        },
      },
    },
  },
  {
    name: 'get_calendar_appointments',
    description: 'Get upcoming calendar appointments',
    inputSchema: {
      type: 'object',
      properties: {
        startDate: {
          type: 'string',
          description: 'Start date for appointments (ISO format, e.g., 2024-01-01)',
        },
        endDate: {
          type: 'string',
          description: 'End date for appointments (ISO format, e.g., 2024-12-31)',
        },
      },
    },
  },
];

// Execute MCP tool
async function executeTool(name: string, args: any) {
  try {
    switch (name) {
      case 'get_account_info': {
        if (!GHL_LOCATION_ID) {
          return {
            content: [
              {
                type: 'text',
                text: 'Error: GHL_LOCATION_ID is not configured. Please set it in your environment variables.',
              },
            ],
          };
        }

        const response = await ghlApi.get(`/locations/${GHL_LOCATION_ID}`);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      case 'list_contacts': {
        if (!GHL_LOCATION_ID) {
          return {
            content: [
              {
                type: 'text',
                text: 'Error: GHL_LOCATION_ID is not configured.',
              },
            ],
          };
        }

        const limit = Math.min((args?.limit as number) || 10, 100);
        const query = args?.query as string | undefined;

        const params: any = {
          locationId: GHL_LOCATION_ID,
          limit,
        };

        if (query) {
          params.query = query;
        }

        const response = await ghlApi.get('/contacts/', { params });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      case 'get_contact': {
        const contactId = args?.contactId as string;
        if (!contactId) {
          return {
            content: [
              {
                type: 'text',
                text: 'Error: contactId is required',
              },
            ],
          };
        }

        const response = await ghlApi.get(`/contacts/${contactId}`);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      case 'list_pipelines': {
        if (!GHL_LOCATION_ID) {
          return {
            content: [
              {
                type: 'text',
                text: 'Error: GHL_LOCATION_ID is not configured.',
              },
            ],
          };
        }

        const response = await ghlApi.get(`/opportunities/pipelines`, {
          params: { locationId: GHL_LOCATION_ID },
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      case 'list_opportunities': {
        if (!GHL_LOCATION_ID) {
          return {
            content: [
              {
                type: 'text',
                text: 'Error: GHL_LOCATION_ID is not configured.',
              },
            ],
          };
        }

        const pipelineId = args?.pipelineId as string | undefined;
        const limit = (args?.limit as number) || 10;

        const params: any = {
          location_id: GHL_LOCATION_ID,
          limit,
        };

        if (pipelineId) {
          params.pipelineId = pipelineId;
        }

        const response = await ghlApi.get('/opportunities/search', { params });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      case 'get_calendar_appointments': {
        if (!GHL_LOCATION_ID) {
          return {
            content: [
              {
                type: 'text',
                text: 'Error: GHL_LOCATION_ID is not configured.',
              },
            ],
          };
        }

        const startDate = args?.startDate as string | undefined;
        const endDate = args?.endDate as string | undefined;

        const params: any = {
          locationId: GHL_LOCATION_ID,
        };

        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const response = await ghlApi.get('/appointments/', { params });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      default:
        return {
          content: [
            {
              type: 'text',
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
    const statusCode = error.response?.status || 'N/A';

    return {
      content: [
        {
          type: 'text',
          text: `Error executing ${name}: ${errorMessage} (Status: ${statusCode})`,
        },
      ],
      isError: true,
    };
  }
}

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'GoHighLevel MCP Server',
    version: '1.0.0',
    protocol: 'MCP over HTTP',
    endpoints: {
      mcp: 'POST /mcp',
      sse: 'GET /sse',
    }
  });
});

// MCP JSON-RPC endpoint
app.post('/mcp', async (req: Request, res: Response) => {
  const { jsonrpc, id, method, params } = req.body;

  // Validate JSON-RPC format
  if (jsonrpc !== '2.0') {
    return res.status(400).json({
      jsonrpc: '2.0',
      id: id || null,
      error: {
        code: -32600,
        message: 'Invalid Request: jsonrpc must be "2.0"',
      },
    });
  }

  try {
    switch (method) {
      case 'initialize': {
        res.json({
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: {},
            },
            serverInfo: {
              name: 'ghl-mcp-server',
              version: '1.0.0',
            },
          },
        });
        break;
      }

      case 'tools/list': {
        res.json({
          jsonrpc: '2.0',
          id,
          result: {
            tools: MCP_TOOLS,
          },
        });
        break;
      }

      case 'tools/call': {
        const { name, arguments: args } = params;
        const result = await executeTool(name, args);
        res.json({
          jsonrpc: '2.0',
          id,
          result,
        });
        break;
      }

      case 'ping': {
        res.json({
          jsonrpc: '2.0',
          id,
          result: {},
        });
        break;
      }

      default:
        res.status(400).json({
          jsonrpc: '2.0',
          id,
          error: {
            code: -32601,
            message: `Method not found: ${method}`,
          },
        });
    }
  } catch (error: any) {
    res.status(500).json({
      jsonrpc: '2.0',
      id,
      error: {
        code: -32603,
        message: `Internal error: ${error.message}`,
      },
    });
  }
});

// SSE endpoint for real-time updates (optional for MCP)
app.get('/sse', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.write('data: {"type":"connected","message":"MCP SSE connection established"}\n\n');

  // Keep connection alive
  const keepAlive = setInterval(() => {
    res.write('data: {"type":"ping"}\n\n');
  }, 30000);

  req.on('close', () => {
    clearInterval(keepAlive);
    res.end();
  });
});

// Legacy REST endpoints (for backward compatibility)
app.get('/tools', (req: Request, res: Response) => {
  res.json({ tools: MCP_TOOLS });
});

app.get('/account', async (req: Request, res: Response) => {
  try {
    if (!GHL_LOCATION_ID) {
      return res.status(400).json({ error: 'GHL_LOCATION_ID is not configured' });
    }
    const response = await ghlApi.get(`/locations/${GHL_LOCATION_ID}`);
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message || 'Unknown error'
    });
  }
});

app.get('/contacts', async (req: Request, res: Response) => {
  try {
    if (!GHL_LOCATION_ID) {
      return res.status(400).json({ error: 'GHL_LOCATION_ID is not configured' });
    }
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const query = req.query.query as string | undefined;
    const params: any = { locationId: GHL_LOCATION_ID, limit };
    if (query) params.query = query;
    const response = await ghlApi.get('/contacts/', { params });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message || 'Unknown error'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`GoHighLevel MCP HTTP Server running on port ${PORT}`);
  console.log(`MCP endpoint: http://localhost:${PORT}/mcp`);
  console.log(`SSE endpoint: http://localhost:${PORT}/sse`);
});
