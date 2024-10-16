import { migrate } from '../../utils/postgres';
import { seedUserTable } from '../../seed';

export default defineEventHandler(async (event) => {
  console.log('Starting server setup...');

  try {
    // Create the database tables
    await migrate();
    
    // Seed the database
    await seedUserTable();
    console.log('Database setup and seed complete');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
});
