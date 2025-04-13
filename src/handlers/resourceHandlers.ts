import { dbAll } from '../db/index.js';
import { getDatabasePath } from '../db/index.js';

/**
 * Handle listing resources request
 * @returns List of available resources
 */
export async function handleListResources() {
  try {
    const databasePath = getDatabasePath();
    const resourceBaseUrl = new URL(`sqlite:///${databasePath}`);
    const SCHEMA_PATH = "schema";

    const result = await dbAll(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    );
    
    return {
      resources: result.map((row: any) => ({
        uri: new URL(`${row.name}/${SCHEMA_PATH}`, resourceBaseUrl).href,
        mimeType: "application/json",
        name: `"${row.name}" database schema`,
      })),
    };
  } catch (error: any) {
    throw new Error(`Error listing resources: ${error.message}`);
  }
}

/**
 * Handle reading a specific resource
 * @param uri URI of the resource to read
 * @returns Resource contents
 */
export async function handleReadResource(uri: string) {
  try {
    const resourceUrl = new URL(uri);
    const SCHEMA_PATH = "schema";

    const pathComponents = resourceUrl.pathname.split("/");
    const schema = pathComponents.pop();
    const tableName = pathComponents.pop();

    if (schema !== SCHEMA_PATH) {
      throw new Error("Invalid resource URI");
    }

    // Query to get column information for a table
    const result = await dbAll(`PRAGMA table_info("${tableName}")`);

    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(result.map((column: any) => ({
            column_name: column.name,
            data_type: column.type
          })), null, 2),
        },
      ],
    };
  } catch (error: any) {
    throw new Error(`Error reading resource: ${error.message}`);
  }
} 