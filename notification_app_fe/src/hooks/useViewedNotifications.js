import { useMemo, useState } from "react";
import { loadViewedIds, saveViewedIds } from "../utils/storage";

export const useViewedNotifications = () => {
  const [viewedIds, setViewedIds] = useState(() => loadViewedIds());
  const viewedSet = useMemo(() => new Set(viewedIds), [viewedIds]);

  const markViewed = (id) => {
    if (!id) return;
    setViewedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      const list = Array.from(next);
      saveViewedIds(list);
      return list;
    });
  };

  const markAllViewed = (ids) => {
    if (!ids?.length) return;
    setViewedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => {
        if (id) next.add(id);
      });
      const list = Array.from(next);
      saveViewedIds(list);
      return list;
    });
  };

  const isViewed = (id, status) => {
    if (status && status.toLowerCase() === "read") return true;
    return viewedSet.has(id);
  };

  return { viewedIds, markViewed, markAllViewed, isViewed };
};
