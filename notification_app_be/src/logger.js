import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(
  __dirname,
  "..",
  "..",
  "logging_middleware",
  ".env",
);

dotenv.config({ path: envPath });

let loggerPromise = null;

function getLogger() {
  if (!loggerPromise) {
    const loggingPath = path.resolve(
      __dirname,
      "..",
      "..",
      "logging_middleware",
      "logging.js",
    );
    loggerPromise = import(pathToFileURL(loggingPath).href).then((mod) =>
      mod.default(),
    );
  }

  return loggerPromise;
}

export async function log(stack, level, pkg, message) {
  const logger = await getLogger();
  return logger(stack, level, pkg, message);
}
