import app from "./src/app.js";
import { log } from "./src/logger.js";

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  void log(
    "backend",
    "info",
    "service",
    `priority inbox service is running on port ${PORT}`,
  );
});
