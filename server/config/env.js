import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from parent directory if they are not already set
// This is primarily for local development where .env is in the root
dotenv.config({ path: '../.env' });

console.log('Environment variables loaded ✅');
