import express from 'express';
import cors from 'cors';
import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
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

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'GoHighLevel MCP Server',
    version: '1.0.0',
    endpoints: {
      health: 'GET /',
      tools: 'GET /tools',
      accountInfo: 'GET /account',
      contacts: 'GET /contacts',
      contact: 'GET /contacts/:id',
      pipelines: 'GET /pipelines',
      opportunities: 'GET /opportunities',
      appointments: 'GET /appointments',
    }
  });
});

// List available tools (MCP compatibility)
app.get('/tools', (req, res) => {
  res.json({
    tools: [
      {
        name: 'get_account_info',
        description: 'Get information about your GoHighLevel account and location',
      },
      {
        name: 'list_contacts',
        description: 'List contacts from your GoHighLevel account with optional filtering',
        parameters: ['limit', 'query']
      },
      {
        name: 'get_contact',
        description: 'Get detailed information about a specific contact',
        parameters: ['contactId']
      },
      {
        name: 'list_pipelines',
        description: 'List all pipelines (sales funnels) in your GoHighLevel account',
      },
      {
        name: 'list_opportunities',
        description: 'List opportunities (deals) from your pipelines',
        parameters: ['pipelineId', 'limit']
      },
      {
        name: 'get_calendar_appointments',
        description: 'Get upcoming calendar appointments',
        parameters: ['startDate', 'endDate']
      },
    ]
  });
});

// Get account info
app.get('/account', async (req, res) => {
  try {
    if (!GHL_LOCATION_ID) {
      return res.status(400).json({
        error: 'GHL_LOCATION_ID is not configured'
      });
    }

    const response = await ghlApi.get(`/locations/${GHL_LOCATION_ID}`);
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message || 'Unknown error'
    });
  }
});

// List contacts
app.get('/contacts', async (req, res) => {
  try {
    if (!GHL_LOCATION_ID) {
      return res.status(400).json({
        error: 'GHL_LOCATION_ID is not configured'
      });
    }

    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const query = req.query.query as string | undefined;

    const params: any = {
      locationId: GHL_LOCATION_ID,
      limit,
    };

    if (query) {
      params.query = query;
    }

    const response = await ghlApi.get('/contacts/', { params });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message || 'Unknown error'
    });
  }
});

// Get specific contact
app.get('/contacts/:id', async (req, res) => {
  try {
    const contactId = req.params.id;
    const response = await ghlApi.get(`/contacts/${contactId}`);
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message || 'Unknown error'
    });
  }
});

// List pipelines
app.get('/pipelines', async (req, res) => {
  try {
    if (!GHL_LOCATION_ID) {
      return res.status(400).json({
        error: 'GHL_LOCATION_ID is not configured'
      });
    }

    const response = await ghlApi.get(`/opportunities/pipelines`, {
      params: { locationId: GHL_LOCATION_ID },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message || 'Unknown error'
    });
  }
});

// List opportunities
app.get('/opportunities', async (req, res) => {
  try {
    if (!GHL_LOCATION_ID) {
      return res.status(400).json({
        error: 'GHL_LOCATION_ID is not configured'
      });
    }

    const pipelineId = req.query.pipelineId as string | undefined;
    const limit = parseInt(req.query.limit as string) || 10;

    const params: any = {
      location_id: GHL_LOCATION_ID,
      limit,
    };

    if (pipelineId) {
      params.pipelineId = pipelineId;
    }

    const response = await ghlApi.get('/opportunities/search', { params });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message || 'Unknown error'
    });
  }
});

// Get calendar appointments
app.get('/appointments', async (req, res) => {
  try {
    if (!GHL_LOCATION_ID) {
      return res.status(400).json({
        error: 'GHL_LOCATION_ID is not configured'
      });
    }

    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;

    const params: any = {
      locationId: GHL_LOCATION_ID,
    };

    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await ghlApi.get('/appointments/', { params });
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
  console.log(`Health check: http://localhost:${PORT}/`);
});
