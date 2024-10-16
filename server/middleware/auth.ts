import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const { url } = event.node.req;
  if (!url?.startsWith('/api')) {
    return; // Do nothing for non-API routes
  }

  // Bypass auth check for specific API routes like login and register
  if (url.startsWith('/api/auth') || url.startsWith('/api/register')) {
    return; // Allow login and register to bypass auth
  }

  //Uncomment for database seeding
  // if (url?.startsWith('/api/database')) {
  //   return;
  // }

  const authHeader = getHeader(event, 'authorization');
  if (!authHeader) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    event.context.auth = decoded; // attach the decoded token to the event context
  } catch (err) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' });
  }
});
