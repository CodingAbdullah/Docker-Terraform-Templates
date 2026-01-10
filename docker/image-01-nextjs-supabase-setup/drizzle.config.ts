import { defineConfig } from "drizzle-kit";

// Determine connection string based on environment
function getConnectionString(): string {
  const supabaseUrl = process.env.SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error("Missing required environment variable: SUPABASE_URL");
  }
  // Docker environment: SUPABASE_URL is already a PostgreSQL connection string
  if (supabaseUrl.startsWith("postgresql://") || supabaseUrl.startsWith("postgres://")) {
    return supabaseUrl;
  }
  // Cloud Supabase: Convert HTTPS URL to PostgreSQL connection string
  if (supabaseUrl.startsWith("https://")) {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variable: SUPABASE_SERVICE_ROLE_KEY");
    }
    return supabaseUrl.replace("https://", `postgresql://postgres:${process.env.SUPABASE_SERVICE_ROLE_KEY}@`) + "/postgres";
  }
  throw new Error("Invalid SUPABASE_URL format. Must start with 'https://' or 'postgresql://'");
}

// Setting Drizzle configuration
export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: getConnectionString(),
  },
});
