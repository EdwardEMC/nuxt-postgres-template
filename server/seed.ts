import { usePostgres } from './utils/postgres';

// Function to seed the database with test data
export const seedUserTable = async () => {
  await usePostgres()`
    INSERT INTO users (email, name, password_hash, service) 
    VALUES 
      ('testuser1@example.com', 'Test User 1', 'hashedpassword1', 'free'),
      ('testuser2@example.com', 'Test User 2', 'hashedpassword2', 'premium')
    ON CONFLICT (email) DO NOTHING;
  `;
  console.log('User data seeded');
};
