import { API_URL, buildAuthHeaders } from "../config.js";
import { log } from "../logger.js";

export async function fetchNotifications() {
  if (!global.fetch) {
    await log("backend", "error", "service", "Fetch API is not available");
    throw new Error("Fetch API is not available in this runtime");
  }

  await log("backend", "info", "service", "Fetching notifications");

  const response = await fetch(API_URL, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  if (!response.ok) {
    await log(
      "backend",
      "error",
      "service",
      `Notification API failed with status ${response.status}`,
    );
    throw new Error(`Notification API failed with status ${response.status}`);
  }

  const payload = await response.json();
  const data = Array.isArray(payload)
    ? payload
    : Array.isArray(payload.notifications)
      ? payload.notifications
      : [];

  await log(
    "backend",
    "info",
    "service",
    `Fetched ${data.length} notifications`,
  );

  return data.map((item) => ({
    id: item.ID || item.id || "",
    type: item.Type || item.type || "",
    message: item.Message || item.message || "",
    timestamp: item.Timestamp || item.timestamp || "",
  }));
}
