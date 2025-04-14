# MCP Database Server

This MCP (Model Context Protocol) server provides database access capabilities to Claude, supporting both SQLite and SQL Server databases.

## Installation

1. Clone the repository:
```
git clone https://github.com/executeautomation/database-server.git
cd database-server
```

2. Install dependencies:
```
npm install
```

3. Build the project:
```
npm run build
```

## Usage

### SQLite Database

To use with an SQLite database:

```
node dist/src/index.js /path/to/your/database.db
```

### SQL Server Database

To use with a SQL Server database:

```
node dist/src/index.js --sqlserver --server <server-name> --database <database-name> [--user <username> --password <password>]
```

Required parameters:
- `--server`: SQL Server host name or IP address
- `--database`: Name of the database

Optional parameters:
- `--user`: Username for SQL Server authentication (if not provided, Windows Authentication will be used)
- `--password`: Password for SQL Server authentication
- `--port`: Port number (default: 1433)

## Configuring Claude

Update your Claude configuration file to add the MCP Database Server:

```json
{
  "mcpServers": {
    "sqlite": {
      "command": "node",
      "args": [
        "/path/to/mcp-database-server/dist/src/index.js", 
        "/path/to/your/database.db"
      ]
    },
    "sqlserver": {
      "command": "node",
      "args": [
        "/path/to/mcp-database-server/dist/src/index.js",
        "--sqlserver",
        "--server", "your-server-name",
        "--database", "your-database-name",
        "--user", "your-username",
        "--password", "your-password"
      ]
    }
  }
}
```

## Available Tools

The MCP Database Server provides the following tools:

- `read_query`: Execute SELECT queries to read data from the database
- `write_query`: Execute INSERT, UPDATE, or DELETE queries
- `create_table`: Create new tables in the database
- `alter_table`: Modify existing table schema (add columns, rename tables, etc.)
- `drop_table`: Remove a table from the database with safety confirmation
- `export_query`: Export query results to various formats (CSV, JSON)
- `list_tables`: Get a list of all tables in the database
- `describe_table`: View schema information for a specific table
- `append_insight`: Add a business insight to the memo
- `list_insights`: List all business insights in the memo

## Development

To run the server in development mode:

```
npm run dev
```

To watch for changes during development:

```
npm run watch
```

## Requirements

- Node.js 18+
- For SQL Server connectivity: SQL Server 2012 or later

## License

MIT
