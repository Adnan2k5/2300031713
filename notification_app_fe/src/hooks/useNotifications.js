import { useCallback, useEffect, useMemo, useState } from "react";
import { getNotifications } from "../services/notificationsApi";

const normalizeType = (value) => (value || "").toString().toLowerCase();

export const useNotifications = ({ page, limit, type }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getNotifications({ page, limit, type });
      setItems(response.items || []);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load notifications.";
      setError(message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, type]);

  useEffect(() => {
    load();
  }, [load]);

  const filteredItems = useMemo(() => {
    if (!type || type === "All") return items;
    const wanted = normalizeType(type);
    return items.filter(
      (item) =>
        normalizeType(
          item.type || item.notification_type || item.notificationType,
        ) === wanted,
    );
  }, [items, type]);

  const hasNextPage = filteredItems.length === limit;

  return { items: filteredItems, loading, error, reload: load, hasNextPage };
};
