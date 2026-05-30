import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(
  __dirname,
  "..",
  "..",
  "logging_middleware",
  ".env",
);

dotenv.config({ path: envPath });

export const API_URL = process.env.NOTIF_API_URL;
export const API_KEY = process.env.NOTIF_API_KEY || process.env.API_KEY || "";
export const TOP_N = Number.parseInt(process.env.TOP_N || "10", 10);

export const TYPE_WEIGHTS = Object.freeze({
  Placement: 3,
  Result: 2,
  Event: 1,
});

export function buildAuthHeaders() {
  const headers = {
    Accept: "application/json",
  };

  if (API_TOKEN) {
    headers.Authorization = `Bearer ${API_TOKEN}`;
  }

  return headers;
}
