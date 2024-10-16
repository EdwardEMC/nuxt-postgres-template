import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { usePostgres } from '../../utils/postgres';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  // Validate email and password
  if (!email || !password) {
    return {
      status: 'error',
      message: 'Email and password are required.',
    };
  }

  const db = usePostgres();

  try {
    // Fetch user from the database
    const user = await db`SELECT * FROM users WHERE email = ${email}`;

    // Check if user exists
    if (user.length === 0) {
      return {
        status: 'error',
        message: 'Invalid email or password.',
      };
    }

    const { password_hash } = user[0];
    const isPasswordValid = await bcrypt.compare(password, password_hash);
    if (!isPasswordValid) {
      return {
        status: 'error',
        message: 'Invalid email or password.',
      };
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    // Generate JWT token
    const token = jwt.sign({ id: user[0].id, email: user[0].email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return { token, user: { id: user[0].id, email: user[0].email, name: user[0].name, sso_provider: user[0].sso_provider, service: user[0].service, has_password: password_hash.length > 0 } };
  } catch (error) {
    console.error('Error logging in user:', error);
    return {
      status: 'error',
      message: 'Login failed',
    };
  }
});
