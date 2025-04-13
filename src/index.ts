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
import { initDatabase, closeDatabase } from './db/index.js';

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
  console.error("Please provide a database file path as a command-line argument");
  process.exit(1);
}

const databasePath = args[0];

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

/**
 * Start the server
 */
async function runServer() {
  try {
    console.log(`Initializing database: ${databasePath}`);
    await initDatabase(databasePath);
    
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
runServer().catch(console.error); 