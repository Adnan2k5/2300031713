import { MinHeap } from "./heap.js";
import { buildScore } from "./score.js";

export function getTopNotifications(notifications, limit, weights) {
  const heap = new MinHeap((a, b) => a.score - b.score);

  for (const notification of notifications) {
    const score = buildScore(notification, weights);
    const item = { notification, score };

    if (heap.size() < limit) {
      heap.push(item);
      continue;
    }

    const currentMin = heap.peek();
    if (currentMin && score > currentMin.score) {
      heap.replace(item);
    }
  }

  return heap
    .toArray()
    .sort((a, b) => b.score - a.score)
    .map((item) => item.notification);
}
