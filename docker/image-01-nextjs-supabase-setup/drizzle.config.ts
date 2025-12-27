import { defineConfig } from "drizzle-kit";

// Setting Drizzle configuration
export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.SUPABASE_URL!.replace('https://', `postgresql://postgres:${process.env.SUPABASE_SERVICE_ROLE_KEY}@`) + '/postgres',
  },
});
