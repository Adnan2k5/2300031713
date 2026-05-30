import express from "express";

import { TOP_N, TYPE_WEIGHTS } from "../config.js";
import { log } from "../logger.js";
import { fetchNotifications } from "../services/notificationService.js";
import { getTopNotifications } from "../utils/priorityInbox.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const limit = Number.parseInt(req.query.limit || TOP_N, 10);
    const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : TOP_N;

    const notifications = await fetchNotifications();
    const top = getTopNotifications(notifications, safeLimit, TYPE_WEIGHTS);

    await log(
      "backend",
      "info",
      "service",
      `Priority inbox fetched ${top.length} items`,
    );

    res.status(200).json({
      items: top,
      count: top.length,
    });
  } catch (error) {
    await log(
      "backend",
      "error",
      "service",
      `Priority inbox failed: ${error.message}`,
    );

    res.status(502).json({
      error: "Failed to load notifications",
    });
  }
});

export default router;
