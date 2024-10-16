import bcrypt from 'bcrypt';
import { usePostgres } from '../../utils/postgres';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, name, password } = body;
  
  const db = usePostgres();

  // Check if user already exists
  const existingUser = await db`SELECT * FROM users WHERE email = ${email}`;

  if (existingUser.length > 0) {
    // User already exists
    return { status: 'error', message: 'User already exists' };
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Insert the new user
    await db`INSERT INTO users (email, name, password_hash) VALUES (${email}, ${name}, ${hashedPassword})`;
    return { status: 'success', message: 'User registered successfully' };
  } catch (error) {
    console.error('Error registering user:', error);
    return { status: 'error', message: 'Internal server error' }; // More generic error message
  }
});
