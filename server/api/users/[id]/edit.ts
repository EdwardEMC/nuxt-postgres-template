import { UserUpdate } from '~/interfaces/user';
import { UpdateFields } from '~/types/user';
import { usePostgres } from '../../../utils/postgres';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const { params } = event.context; // Extract params from the context

  // Validate that params and id are defined
  if (!params || !params.id) {
    return { status: 'error', message: 'User ID is required' };
  }

  const id = params.id; // Get the id safely
  const { name, email } = await readBody(event);
  const user: UserUpdate = { name, email };
  

  const updates: UpdateFields[] = [];
  if (name) updates.push('name');
  if (email) updates.push('email');

  // Check if there are any fields to update
  if (updates.length === 0) {
    return { status: 'error', message: 'No fields to update' };
  }

  const db = usePostgres();

  // Build the query
  const query = db`UPDATE users 
    SET ${db(user, updates)}
    WHERE id = ${id}
  `;

  try {
    // Execute the query
    await query;
    return { status: 'success', message: 'User updated successfully' };
  } catch (error) {
    console.error('Error updating user:', error);
    return { status: 'error', message: 'Internal server error' };
  }
});
