import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || 'development';
const envPath = path.resolve(__dirname, `../.env.${env}.local`);

config({ path: envPath, override: true });

export const {
    PORT = '3000',
    NODE_ENV = env,
    DB_URL,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    ADMIN_SECRET_KEY
} = process.env;

if (!DB_URL) {
    throw new Error(`DB_URL is missing. Tried to load: ${envPath}`);
}
