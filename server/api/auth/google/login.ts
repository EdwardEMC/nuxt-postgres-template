import jwt from 'jsonwebtoken';
import { usePostgres } from '../../../utils/postgres';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, ssoId } = body; // Expecting email and ssoId in the request body

  // Validate email and ssoId
  if (!email || !ssoId) {
    return {
      status: 'error',
      message: 'Email and ssoId are required.',
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
        message: 'User does not exist.',
      };
    }

    // Optionally check if ssoId matches the stored ssoId for this user
    const { sso_id, password_hash } = user[0];
    if (ssoId !== sso_id) {
      return {
        status: 'error',
        message: 'Invalid SSO ID.',
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

    console.log(password_hash);

    return { token, user: { id: user[0].id, email: user[0].email, name: user[0].name, sso_provider: user[0].sso_provider, service: user[0].service, has_password: password_hash !== null } };
  } catch (error) {
    console.error('Error logging in user:', error);
    return {
      status: 'error',
      message: 'Login failed',
    };
  }
});
