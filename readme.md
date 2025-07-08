[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/executeautomation-mcp-database-server-badge.png)](https://mseep.ai/app/executeautomation-mcp-database-server)

# MCP Database Server (Security Pack)

This is a security-enhanced fork of the original MCP (Model Context Protocol) server, which provides database access capabilities to Claude, supporting SQLite, SQL Server, PostgreSQL, and MySQL databases.

**Special thanks to the original authors at ExecuteAutomation for creating the foundation of this project.**

## Disclaimer

**This project is intended for research and educational purposes only. It is not designed for production use and should be used with caution. The authors are not responsible for any data loss or security incidents that may result from its use.**

**Important: This security-enhanced version must be run from a local clone of the repository. Do not install or use any similarly named packages from the NPM registry, as they will not contain these security features.**

## Installation

1. Clone the repository:
```
git clone https://github.com/tyouritsugun/mcp-database-server.git
cd mcp-database-server
```

2. Install dependencies:
```
npm install
```

3. Build the project:
```
npm run build
```

## Security Best Practices

This security-enhanced version of the MCP Database Server introduces a new command-line argument, `--block-command`, to prevent dangerous or destructive SQL operations from being executed. This provides a server-level safeguard against unintended data modification.

For maximum security, we recommend a two-layered approach:
1.  **Application Layer**: Use the `--block-command` argument to explicitly disable commands like `DELETE`, `TRUNCATE`, `DROP`, and `UPDATE`.
2.  **Database Layer**: Connect to your database using a dedicated, read-only user.

This combination ensures that even if the application-level block fails or is misconfigured, the database's own permission system will prevent unauthorized actions. It is strongly recommended to create a dedicated, read-only database user for this MCP server to minimize the risk of accidental or malicious data modification.

### Creating a Read-Only User in PostgreSQL

To create a read-only user in PostgreSQL, connect to your database with an admin account and run the following SQL commands:

```sql
-- Create a new user with a secure password
CREATE USER mcp_user WITH PASSWORD 'your_secure_password';

-- Grant connect access to the database
GRANT CONNECT ON DATABASE your_database_name TO mcp_user;

-- Grant usage access to the public schema
GRANT USAGE ON SCHEMA public TO mcp_user;

-- Grant select-only permissions on all existing tables in the public schema
GRANT SELECT ON ALL TABLES IN SCHEMA public TO mcp_user;

-- Set default permissions to grant select-only on new tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public FOR ROLE mcp_user GRANT SELECT ON TABLES TO mcp_user;
```

### Creating a Read-Only User in MySQL

To create a read-only user in MySQL, connect to your database with an admin account and run the following SQL commands:

```sql
-- Create a new user and grant access from a specific IP or '%' for any host
CREATE USER 'mcp_user'@'localhost' IDENTIFIED BY 'your_secure_password';

-- Grant select-only permissions on all tables in your database
GRANT SELECT ON your_database_name.* TO 'mcp_user'@'localhost';

-- Apply the new permissions
FLUSH PRIVILEGES;
```

## Usage

### SQLite Database

To use with an SQLite database and block dangerous commands:

```bash
node dist/src/index.js /path/to/your/database.db \
  --block-command "DELETE,TRUNCATE,DROP,UPDATE"
```

### SQL Server Database

To use with a SQL Server database and block dangerous commands:

```bash
node dist/src/index.js \
  --sqlserver \
  --server <server-name> \
  --database <database-name> \
  --user <username> \
  --password <password> \
  --block-command "DELETE,TRUNCATE,DROP,UPDATE"
```

### PostgreSQL Database

To use with a PostgreSQL database and block dangerous commands:

```bash
node dist/src/index.js \
  --postgresql \
  --host <host-name> \
  --database <database-name> \
  --user <username> \
  --password <password> \
  --block-command "DELETE,TRUNCATE,DROP,UPDATE"
```

### MySQL Database

To use with a MySQL database and block dangerous commands:

```bash
node dist/src/index.js \
  --mysql \
  --host <host-name> \
  --database <database-name> \
  --port <port> \
  --user <username> \
  --password <password> \
  --block-command "DELETE,TRUNCATE,DROP,UPDATE"
```

## Configuring Claude Desktop

To configure Claude Desktop, you must use the absolute path to your locally built version of the server.

```json
{
  "mcpServers": {
    "postgresql": {
      "command": "node",
      "args": [
        "/absolute/path/to/mcp-database-server/dist/src/index.js",
        "--postgresql",
        "--host", "your-host-name",
        "--database", "your-database-name",
        "--user", "your-username",
        "--password", "your-password",
        "--block-command", "DELETE,TRUNCATE,DROP,UPDATE"
      ]
    }
  }
}
```

The Claude Desktop configuration file is typically located at:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

## Available Database Tools

The MCP Database Server provides the following tools that Claude can use:

| Tool | Description | Required Parameters |
|------|-------------|---------------------|
| `read_query` | Execute SELECT queries to read data | `query`: SQL SELECT statement |
| `write_query` | Execute INSERT, UPDATE, or DELETE queries | `query`: SQL modification statement |
| `create_table` | Create new tables in the database | `query`: CREATE TABLE statement |
| `alter_table` | Modify existing table schema | `query`: ALTER TABLE statement |
| `drop_table` | Remove a table from the database | `table_name`: Name of table<br>`confirm`: Safety flag (must be true) |
| `list_tables` | Get a list of all tables | None |
| `describe_table` | View schema information for a table | `table_name`: Name of table |
| `export_query` | Export query results as CSV/JSON | `query`: SQL SELECT statement<br>`format`: "csv" or "json" |
| `append_insight` | Add a business insight to memo | `insight`: Text of insight |
| `list_insights` | List all business insights | None |

For practical examples of how to use these tools with Claude, see [Usage Examples](docs/usage-examples.md).

## Additional Documentation

- [SQL Server Setup Guide](docs/sql-server-setup.md): Details on connecting to SQL Server databases
- [PostgreSQL Setup Guide](docs/postgresql-setup.md): Details on connecting to PostgreSQL databases
- [Usage Examples](docs/usage-examples.md): Example queries and commands to use with Claude

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
- For PostgreSQL connectivity: PostgreSQL 9.5 or later

## License

MIT