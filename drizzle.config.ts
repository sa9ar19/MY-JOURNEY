import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load the .env file from the /server folder
dotenv.config({ path: "./server/.env" }); 

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
});
