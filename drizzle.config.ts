import "dotenv/config";
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL belum diisi di file .env");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema", // membaca semua file di folder ini
  out: "./drizzle", // hasil migrasi (commit ke git)
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  strict: true,
  verbose: true,
});
