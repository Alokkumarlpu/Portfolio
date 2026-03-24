import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootEnvPath = path.resolve(__dirname, '../../.env');
const serverEnvPath = path.resolve(__dirname, '../.env');

// Load .env for local development. In Render, env vars are injected by platform.
const rootResult = dotenv.config({ path: rootEnvPath });
if (rootResult.error) {
	dotenv.config({ path: serverEnvPath });
}

console.log('Environment variables initialized');
