import { usePostgres } from '../../../utils/postgres';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, name, ssoId } = body; // Expecting ssoId in the request body

  const db = usePostgres();

  // Check if user already exists
  const existingUser = await db`SELECT * FROM users WHERE email = ${email}`;
  if (existingUser.length > 0) {
    // User already exists, return success or handle as needed
    return { status: 'success', message: 'User already exists', user: existingUser[0] };
  }

  try {
    // Insert the new user
    await db`INSERT INTO users (email, name, sso_provider, sso_id) VALUES (${email}, ${name}, 'google', ${ssoId})`;
    return { status: 'success', message: 'User registered successfully' };
  } catch (error) {
    console.error('Error registering user:', error);
    return { status: 'error', message: 'Internal server error' }; // More generic error message
  }
});
