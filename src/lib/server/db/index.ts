import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '$env/dynamic/private';
import postgres from 'postgres';

import * as authSchema from './auth-schema';
import * as appSchema from './schema';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const schema = { ...authSchema, ...appSchema };

const client = postgres(env.DATABASE_URL);

export const db = drizzle(client, { casing: 'snake_case', schema });
