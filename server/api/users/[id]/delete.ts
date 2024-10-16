import { usePostgres } from '../../../utils/postgres';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const { params } = event.context; // Extract params from the context

  // Validate that params and id are defined
  if (!params || !params.id) {
    return { status: 'error', message: 'User ID is required' };
  }

  const id = params.id; // Get the id safely

  // Validate that the supplied Id matches the stored token id
  if (event.context.auth.id !== id) {
    return { status: 'error', message: 'User ID does not match authenticated. Logout and then login and try again.' };
  }

  const db = usePostgres();

  // Build the query
  const query = db`DELETE FROM users WHERE id = ${id}`;

  try {
    // Execute the query
    await query;
    return { status: 'success', message: 'User delete successfully' };
  } catch (error) {
    console.error('Error updating user:', error);
    return { status: 'error', message: 'Internal server error' };
  }
});
