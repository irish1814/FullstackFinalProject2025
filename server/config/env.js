import { config } from 'dotenv';

const env = process.env.NODE_ENV || 'development';
const path = `.env.${env}.local`; 

config({ path, override: true }); 

export const {
    PORT = '3000',
    NODE_ENV = env,
    DB_URL,
    JWT_SECRET,
    ADMIN_SECRET_KEY
} = process.env;

if (!DB_URL) {
  throw new Error(`DB_URL is missing. Tried to load: ${path}`);
}
