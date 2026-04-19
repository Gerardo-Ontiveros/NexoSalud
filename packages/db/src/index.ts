import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL no está definida");
}

const dbUrl = new URL(connectionString);

const rawPassword = dbUrl.password;
const cleanPassword = rawPassword.includes("%")
  ? decodeURIComponent(rawPassword)
  : rawPassword;

const pool = new pg.Pool({
  user: dbUrl.username,
  password: String(cleanPassword),
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port || "5432"),
  database: dbUrl.pathname.slice(1),
  ssl: false,
});

pool.on("error", (err) => {
  console.error("Error inesperado en el Pool de Postgres:", err);
});

const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({
  adapter,
  log: ["query", "info", "warn", "error"],
});

export * from "@prisma/client";
