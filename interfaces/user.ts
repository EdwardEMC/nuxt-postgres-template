export interface User {
  id: string;
  name: string;
  email: string;
  service: string;
  sso?: string;
  has_password?: string; //Determine if an sso based user has set a password
}

export interface UserUpdate {
  email?: string;
  name?: string;
}
