#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Import database utils
import { initDatabase, closeDatabase, getDatabaseMetadata } from './db/index.js';

// Import handlers
import { handleListResources, handleReadResource } from './handlers/resourceHandlers.js';
import { handleListTools, handleToolCall } from './handlers/toolHandlers.js';

// Configure the server
const server = new Server(
  {
    name: "executeautomation/database-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  },
);

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Please provide database connection information");
  console.error("Usage for SQLite: node index.js <database_file_path>");
  console.error("Usage for SQL Server: node index.js --sqlserver --server <server> --database <database> [--user <user> --password <password>]");
  process.exit(1);
}

// Parse arguments to determine database type and connection info
let dbType = 'sqlite';
let connectionInfo: any = null;

// Check if using SQL Server
if (args.includes('--sqlserver')) {
  dbType = 'sqlserver';
  connectionInfo = {
    server: '',
    database: '',
    user: undefined,
    password: undefined
  };
  
  // Parse SQL Server connection parameters
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--server' && i + 1 < args.length) {
      connectionInfo.server = args[i + 1];
    } else if (args[i] === '--database' && i + 1 < args.length) {
      connectionInfo.database = args[i + 1];
    } else if (args[i] === '--user' && i + 1 < args.length) {
      connectionInfo.user = args[i + 1];
    } else if (args[i] === '--password' && i + 1 < args.length) {
      connectionInfo.password = args[i + 1];
    } else if (args[i] === '--port' && i + 1 < args.length) {
      connectionInfo.port = parseInt(args[i + 1], 10);
    }
  }
  
  // Validate SQL Server connection info
  if (!connectionInfo.server || !connectionInfo.database) {
    console.error("Error: SQL Server requires --server and --database parameters");
    process.exit(1);
  }
} else {
  // SQLite mode (default)
  dbType = 'sqlite';
  connectionInfo = args[0]; // First argument is the SQLite file path
  console.log(`Using SQLite database at path: ${connectionInfo}`);
}

// Set up request handlers
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return await handleListResources();
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  return await handleReadResource(request.params.uri);
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return handleListTools();
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  return await handleToolCall(request.params.name, request.params.arguments);
});

// Handle shutdown gracefully
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await closeDatabase();
  process.exit(0);
});

// Add global error handler
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

/**
 * Start the server
 */
async function runServer() {
  try {
    console.log(`Initializing ${dbType} database...`);
    if (dbType === 'sqlite') {
      console.log(`Database path: ${connectionInfo}`);
    } else if (dbType === 'sqlserver') {
      console.log(`Server: ${connectionInfo.server}, Database: ${connectionInfo.database}`);
    }
    
    // Initialize the database
    await initDatabase(connectionInfo, dbType);
    
    const dbInfo = getDatabaseMetadata();
    console.log(`Connected to ${dbInfo.name} database`);
    
    console.log('Starting MCP server...');
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    console.log('Server running. Press Ctrl+C to exit.');
  } catch (error) {
    console.error("Failed to initialize:", error);
    process.exit(1);
  }
}

// Start the server
runServer().catch(error => {
  console.error("Server initialization failed:", error);
  process.exit(1);
}); 