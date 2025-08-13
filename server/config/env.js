import { config } from 'dotenv';

config( { path: `.env.${process.env.NODE_ENV || 'development'}.local` , quiet: true } );

export const { PORT, NODE_ENV, DB_URL, JWT_SECRET } = process.env;

