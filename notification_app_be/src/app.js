import express from "express";

import priorityInboxRouter from "./routes/priorityInbox.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/priority-inbox", priorityInboxRouter);

export default app;
