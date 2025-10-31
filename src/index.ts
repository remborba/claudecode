#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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

// Define available tools
const TOOLS: Tool[] = [
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

// Create server instance
const server = new Server(
  {
    name: 'ghl-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_account_info': {
        if (!GHL_LOCATION_ID) {
          return {
            content: [
              {
                type: 'text',
                text: 'Error: GHL_LOCATION_ID is not configured. Please set it in your .env file.',
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
                text: 'Error: GHL_LOCATION_ID is not configured. Please set it in your .env file.',
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
                text: 'Error: GHL_LOCATION_ID is not configured. Please set it in your .env file.',
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
                text: 'Error: GHL_LOCATION_ID is not configured. Please set it in your .env file.',
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
                text: 'Error: GHL_LOCATION_ID is not configured. Please set it in your .env file.',
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
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('GoHighLevel MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
