# ExecuteAutomation Database Server

A Model Context Protocol server that provides access to SQLite databases. This server enables LLMs like Claude to inspect database schemas and execute SQL queries.

## Components

### Tools

The server offers nine core tools:

#### Query Tools
- **read_query**
  - Execute SELECT queries to read data from the database
  - Input:
    - `query` (string): The SELECT SQL query to execute
  - Returns: Query results as array of objects

- **write_query**
  - Execute INSERT, UPDATE, or DELETE queries
  - Input:
    - `query` (string): The SQL modification query
  - Returns: `{ affected_rows: number }`

#### Schema Management Tools
- **create_table**
  - Create new tables in the database
  - Input:
    - `query` (string): CREATE TABLE SQL statement
  - Returns: Confirmation of table creation

- **alter_table**
  - Modify existing table schema (add columns, rename tables, etc.)
  - Input:
    - `query` (string): ALTER TABLE SQL statement
  - Returns: Confirmation of table alteration

- **drop_table**
  - Remove a table from the database with safety confirmation
  - Input:
    - `table_name` (string): Name of the table to drop
    - `confirm` (boolean): Safety confirmation flag (must be true to actually drop)
  - Returns: Confirmation message or safety warning

#### Schema Information Tools
- **list_tables**
  - Get a list of all tables in the database
  - No input required
  - Returns: Array of table names

- **describe_table**
  - View schema information for a specific table
  - Input:
    - `table_name` (string): Name of table to describe
  - Returns: Array of column definitions with names and types

#### Data Export Tools
- **export_query**
  - Export query results to various formats
  - Input:
    - `query` (string): The SELECT SQL query to execute
    - `format` (string): Output format - either "csv" or "json"
  - Returns: Query results formatted as CSV or JSON

#### Insights
- **append_insight**
  - Add a business insight to the memo
  - Input:
    - `insight` (string): Business insight discovered from data analysis
  - Returns: Confirmation message

### Resources

The server provides schema information for each table in the database:

- **Table Schemas** (`sqlite:///<path>/<table>/schema`)
  - JSON schema information for each table
  - Includes column names and data types
  - Automatically discovered from database metadata

## Usage with Claude Desktop

To use this server with the Claude Desktop app, add the following configuration to the "mcpServers" section of your `claude_desktop_config.json`:

### Docker

```json
{
  "mcpServers": {
    "database": {
      "command": "docker",
      "args": [
        "run", 
        "-i", 
        "--rm", 
        "executeautomation/database-server", 
        "/path/to/database.db"]
    }
  }
}
```

### NPX (Published Package)

```json
{
  "mcpServers": {
    "database": {
      "command": "npx",
      "args": [
        "-y",
        "@executeautomation/database-server",
        "/path/to/database.db"
      ]
    }
  }
}
```

### Local Development

For local development and debugging, you can point directly to your compiled JavaScript file:

```json
{
  "mcpServers": {
    "database": {
      "command": "node",
      "args": [
        "/path/to/your/project/dist/index.js", 
        "/path/to/your/database.db"
      ]
    }
  }
}
```

Example with full paths:

```json
{
  "mcpServers": {
    "database": {
      "command": "node",
      "args": [
        "/Users/username/projects/database-server/dist/index.js", 
        "/Users/username/databases/mydata.db"
      ]
    }
  }
}
```

The Claude Desktop config file is typically located at:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

Replace all paths with your actual file paths.

## Building and Development

### Quick Build

Use the included build script to install dependencies and build the project:

```sh
chmod +x build.sh
./build.sh
```

### Manual Build Steps

```sh
# Install dependencies
npm install

# Build the TypeScript
npm run build
```

### Docker Build

```sh
docker build -t executeautomation/database-server -f Dockerfile . 
```

## Troubleshooting

If you encounter connection issues:

1. Make sure the database file path is correct and accessible
2. Verify that the compiled JavaScript file exists at the specified path
3. Check the Claude Desktop logs for detailed error messages
4. Restart Claude Desktop after making configuration changes

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License.

## About ExecuteAutomation

This server is maintained by ExecuteAutomation. Visit [executeautomation.com](https://executeautomation.com) for more tools and resources.
