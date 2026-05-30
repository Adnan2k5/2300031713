import { parseTimestamp } from "./time.js";

export function buildScore(notification, weights) {
  const weight = weights[notification.type] || 0;
  const timestamp = parseTimestamp(notification.timestamp);

  return weight * 1_000_000_000_000_000 + timestamp;
}
