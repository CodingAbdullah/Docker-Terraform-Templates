import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.SUPABASE_URL) {
  throw new Error("Missing required environment variable: SUPABASE_URL");
}

// Determine connection string based on environment
let connectionString: string;

if (process.env.SUPABASE_URL.startsWith('postgresql://') || process.env.SUPABASE_URL.startsWith('postgres://')) {
  // Docker environment: SUPABASE_URL is already a PostgreSQL connection string
  connectionString = process.env.SUPABASE_URL;
} else if (process.env.SUPABASE_URL.startsWith('https://')) {
  // Cloud Supabase: Convert HTTPS URL to PostgreSQL connection string
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing required environment variable: SUPABASE_SERVICE_ROLE_KEY");
  }
  connectionString = process.env.SUPABASE_URL.replace(
    'https://',
    `postgresql://postgres:${process.env.SUPABASE_SERVICE_ROLE_KEY}@`
  ) + '/postgres';
} else {
  throw new Error("Invalid SUPABASE_URL format. Must start with 'https://' or 'postgresql://'");
}

const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
