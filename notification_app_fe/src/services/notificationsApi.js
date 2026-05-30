import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api";
const apiBaseUrl = rawBaseUrl.replace(/\/notifications\/?$/, "");
const apiToken = import.meta.env.VITE_API_TOKEN;
const apiUserId = import.meta.env.VITE_USER_ID;

const client = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    Accept: "application/json",
  },
});

client.interceptors.request.use((config) => {
  if (apiToken) {
    config.headers.Authorization = `Bearer ${apiToken}`;
  }
  if (apiUserId) {
    config.headers["X-User-Id"] = apiUserId;
  }
  return config;
});

const normalizeItem = (item) => {
  if (!item || typeof item !== "object") return null;
  const id = item.id || item.ID || item.notification_id || item.notificationId;
  const message =
    item.message || item.Message || item.body || item.description || "";
  const title =
    item.title ||
    item.Title ||
    item.heading ||
    item.subject ||
    message ||
    "Untitled notification";
  const type =
    item.type ||
    item.Type ||
    item.notification_type ||
    item.notificationType ||
    "General";
  const status = item.status || item.Status || "";
  const createdAt =
    item.createdAt ||
    item.CreatedAt ||
    item.created_at ||
    item.timestamp ||
    item.Timestamp ||
    "";

  return { ...item, id, title, message, type, status, createdAt };
};

const normalizeItems = (data) => {
  let list = [];
  if (Array.isArray(data)) list = data;
  if (Array.isArray(data?.items)) list = data.items;
  if (Array.isArray(data?.notifications)) list = data.notifications;
  return list.map(normalizeItem).filter(Boolean);
};

export const getNotifications = async ({ page, limit, type }) => {
  const params = { page, limit };
  if (type && type !== "All") {
    params.notification_type = type;
  }
  const response = await client.get("/notifications", { params });
  return { items: normalizeItems(response.data), raw: response.data };
};

export const getPriorityInbox = async ({ limit, type }) => {
  const params = { limit };
  if (type && type !== "All") {
    params.notification_type = type;
  }
  const response = await client.get("/priority-inbox", { params });
  return { items: normalizeItems(response.data), raw: response.data };
};
