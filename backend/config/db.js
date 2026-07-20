import postgres from "postgres";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const { DATABASE_URL, PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const connectionString =
    DATABASE_URL ||
    `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require&channel_binding=require`;

export const sql = postgres(connectionString, {
    ssl: "require",
    prepare: false,
});
