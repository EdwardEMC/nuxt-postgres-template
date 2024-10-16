import { usePostgres } from '../../../../utils/postgres';
import { defineEventHandler, readBody } from 'h3';
import bcrypt from 'bcrypt';

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

  const { currentPassword, newPassword } = await readBody(event);

  // Validate that both passwords are provided
  if (!currentPassword || !newPassword) {
    return { status: 'error', message: 'Current and new passwords are required' };
  }

  const db = usePostgres();

  try {
    // Fetch the user from the database to verify the current password
    const userResult = await db`SELECT * FROM users WHERE id = ${id}`;
    const user = userResult[0];

    // If the user doesn't exist
    if (!user) {
      return { status: 'error', message: 'User not found' };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Verify the current password
    const isPasswordValid = await verifyPassword(currentPassword, user.password_hash);
    if (!isPasswordValid) {
      return { status: 'error', message: 'Current password is incorrect' };
    }

    // Update the password in the database
    await db`UPDATE users SET password_hash = ${hashedPassword} WHERE id = ${id}`;

    return { status: 'success', message: 'Password updated successfully' };
  } catch (error) {
    console.error('Error updating password:', error);
    return { status: 'error', message: 'Internal server error' };
  }
});

// Function to verify the current password
const verifyPassword = async (inputPassword: string, storedPassword: string) => {
  return await bcrypt.compare(inputPassword, storedPassword);
}
