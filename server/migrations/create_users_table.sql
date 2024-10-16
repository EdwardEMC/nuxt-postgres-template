/**
 * Create the users table to store user information and manage authentication.
 *
 * This table contains the necessary fields for user registration and authentication,
 * including support for single sign-on (SSO) and two-factor authentication (2FA).
 * Each user record consists of the following attributes:
 *
 * - id: A UUID that uniquely identifies each user, automatically generated using uuid_generate_v4().
 * - email: A required, unique string to store the user's email address.
 * - name: A required string to store the user's full name.
 * - password_hash: An optional string to store the hashed password for password-based authentication.
 * - sso_provider: An optional string to specify the SSO provider (e.g., 'google', 'facebook').
 * - sso_id: An optional string to store the unique identifier provided by the SSO provider.
 * - is_2fa_enabled: A boolean flag indicating whether two-factor authentication is enabled for the user,
 *   defaulting to FALSE.
 * - 2fa_secret: An optional string to store the secret used for two-factor authentication.
 * - service: A string indicating the user's subscription service, defaulting to 'free' 
 *   (can be 'free', 'premium', etc.).
 * - created_at: A timestamp indicating when the user was created, defaulting to the current timestamp.
 * - updated_at: A timestamp that updates automatically whenever the user record is modified.
 *
 * The table ensures that each user is uniquely identifiable by their UUID and email.
 */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- Enable the UUID extension in PostgreSQL

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  -- UUID as the primary key, automatically generated
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),  -- Optional for password-based authentication
  sso_provider VARCHAR(50),    -- To store SSO provider (e.g., 'google', 'facebook')
  sso_id VARCHAR(255),         -- Unique ID from the SSO provider
  is_twofa_enabled BOOLEAN DEFAULT FALSE,  -- Boolean flag for 2FA
  two_fa_secret VARCHAR(255),  -- To store the 2FA secret (renamed)
  service VARCHAR(50) NOT NULL DEFAULT 'free',  -- The service a user is on (e.g., 'free', 'premium')
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create a trigger function to update the `updated_at` column on row updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger to call the function on UPDATE
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();