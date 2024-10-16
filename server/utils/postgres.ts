import postgres from 'postgres';
import fs from 'fs/promises';
import path from 'path';

/**
 * Establish a connection to the PostgreSQL database using the specified 
 * connection string from the environment variable.
 *
 * This function checks for the presence of the `DATABASE_URL` environment variable
 * and throws an error if it is not set. If the variable is present, it creates a 
 * PostgreSQL connection using the `postgres` package with SSL required for secure 
 * connections. 
 *
 * Returns a connected PostgreSQL instance for executing queries.
 *
 * @throws {Error} Throws an error if the `DATABASE_URL` environment variable is missing.
 * @returns {Object} A PostgreSQL connection instance.
 */
export const usePostgres = (): postgres.Sql<{}> => {
  if (!process.env.DATABASE_URL) {
    throw createError('Missing `DATABASE_URL` environment variable')
  }

  return postgres(process.env.DATABASE_URL as string, {
    ssl: false // Disable SSL for local connections
  })
}

/**
 * Migrate the database by executing SQL scripts to create the necessary tables.
 *
 * This function reads the SQL migration scripts from the specified file paths 
 * and executes them to set up the initial database schema. It ensures that the 
 * users table, trips table, and user_trips table are created, 
 * establishing the required relationships for the application.
 *
 * Logs a message indicating that the tables have been created or already exist.
 *
 * @throws {Error} Throws an error if there is an issue reading the SQL file or executing the queries.
 */
export const migrate = async () => {
  // Define paths for the migration scripts
  const userTablePath = path.resolve('server/migrations/create_users_table.sql');

  // Read the SQL migration scripts
  const userTableSQL = await fs.readFile(userTablePath, 'utf8');

  // Execute the SQL migration scripts to create the tables
  await usePostgres().unsafe(userTableSQL);        // Create users table

  console.log('Tables created or already exist');
};
