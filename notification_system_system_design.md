## Stage 1

## Objective

Design REST API endpoints, JSON contracts, and headers to power a campus notification platform for Placements, Events, and Results. Include a real time notification mechanism.

## Assumptions

All requests are pre-authorized. No login or registration endpoints are required.

A header is still needed to identify the current user (student) so the system can route notifications.

**Request**

- `Accept: application/json`
- `Content-Type: application/json` (only for requests with a body)
- `X-User-Id: <string>` (required for user scoped operations)
- `X-Admin-Key` (for admin)

**Response**

- `Content-Type: application/json`
- `X-Request-Id: <string>`

## Notification object

```json
{
  "id": "ntf_2f1b8",
  "title": "Placement Drive: ACME Corp",
  "message": "ACME Corp drive on June 3, 10:00 AM in Auditorium.",
  "type": "placement",
  "status": "unread",
  "createdAt": "2026-05-30T10:15:00Z"
}
```

**Values**

- `type`: `placement` | `event` | `result`
- `status`: `unread` | `read` | `archived`

## REST API endpoints

### 1-> List notifications

**GET** `/notifications`

**Query params**

- `type`: optional, `placement|event|result`
- `status`: optional, `unread|read|archived`
- `limit`: optional, default `20`
- `cursor`: optional

**Request headers**

- `X-User-Id` required

**Response 200**

```json
{
  "items": [
    {
      "id": "ntf_2f1b8",
      "title": "Placement Drive: ACME Corp",
      "message": "ACME Corp drive on June 3, 10:00 AM in Auditorium.",
      "type": "placement",
      "status": "unread",
      "createdAt": "2026-05-30T10:15:00Z"
    }
  ],
  "nextCursor": "eyJvZmZzZXQiOjIw"
}
```

### 2-> Get a single notification

**GET** `/notifications/{id}`

**Request headers**

- `X-User-Id` required

**Response 200**

```json
{
  "id": "ntf_2f1b8",
  "title": "Placement Drive: ACME Corp",
  "message": "ACME Corp drive on June 3, 10:00 AM in Auditorium.",
  "type": "placement",
  "status": "unread",
  "createdAt": "2026-05-30T10:15:00Z"
}
```

### 3-> Publish notification

**POST** `/notifications`

**Request headers**

- `X-Admin-Key` required

**Request body**

```json
{
  "target": {
    "userIds": ["stu_123", "stu_456"]
  },
  "title": "Placement Drive: ACME Corp",
  "message": "ACME Corp drive on June 3, 10:00 AM in Auditorium.",
  "type": "placement"
}
```

**Response 201**

```json
{
  "id": "ntf_2f1b8",
  "status": "created"
}
```

## Real-time notifications

**WebSocket** `wss://localhost:8080/realtime/notifications`

**Connection headers**

- `X-User-Id` required

**Server push message**

```json
{
  "event": "notification.created",
  "data": {
    "id": "ntf_30a9c",
    "title": "Results Published: Semester 6",
    "message": "Your Semester 6 results are now available.",
    "type": "result",
    "status": "unread",
    "createdAt": "2026-05-30T11:05:00Z"
  }
}
```

## Stage 2

## Suggested DB

**PostgreSQL**

**Because**

- Strong consistency and ACID transactions for reliable storage
- Simple joins for user specific inbox
- Good indexing and partitioning options as volume grows

## Schema

```sql
CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('placement', 'event', 'result')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  action_url TEXT
);

CREATE TABLE notification_recipients (
  notification_id TEXT NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
  read_at TIMESTAMP,
  PRIMARY KEY (notification_id, user_id)
);

CREATE INDEX idx_recipients_user_created
  ON notification_recipients (user_id);

CREATE INDEX idx_notifications_type_created
  ON notifications (type, created_at DESC);
```

## Scale problems

- Large inbox per user can slow list queries
- Indexes and storage growth increase write cost
- Old notifications make queries and backups heavy

## Solutions

- Add composite index: `(user_id, status, notification_id)`
- Partition `notifications` by month on `created_at`

## Queries based on Stage 1 APIs

**Publish notification (POST /notifications)**

```sql
BEGIN;
INSERT INTO notifications (id, title, message, type, action_url)
VALUES (:id, :title, :message, :type, :action_url);

INSERT INTO notification_recipients (notification_id, user_id)
VALUES
  (:id, 'stu_123'),
  (:id, 'stu_456');
COMMIT;
```

**List notifications (GET /notifications)**

```sql
SELECT n.id, n.title, n.message, n.type, r.status, n.created_at, n.action_url
FROM notification_recipients r
JOIN notifications n ON n.id = r.notification_id
WHERE r.user_id = :user_id
  AND (:type IS NULL OR n.type = :type)
  AND (:status IS NULL OR r.status = :status)
ORDER BY n.created_at DESC
LIMIT :limit;
```

**Get a single notification (GET /notifications/{id})**

```sql
SELECT n.id, n.title, n.message, n.type, r.status, n.created_at, n.action_url
FROM notification_recipients r
JOIN notifications n ON n.id = r.notification_id
WHERE r.user_id = :user_id
  AND n.id = :id;
```

## Stage 3

## Query accuracy

The query is accurate only if `notifications` stores per student rows with `studentID` and `status`. In a normalized design, it is not accurate because status is per student.

## Why it is slow

- Full scan on a large table
- Missing composite index for `studentID`, `status`, `createdAt`
- `ORDER BY createdAt` forces a sort
- `SELECT *` fetches extra data

## What to change

- Add composite index `(studentID, status, createdAt)`
- Select required columns only
- Use `LIMIT` for pagination

**Cost**

- Current: O(n log n)
- With index: O(log n)

## Index every column?

It is Not effective as tt increases write cost and storage, and most queries use only a few indexes.

## Better unread query

```sql
SELECT id, title, message, notificationType, createdAt
FROM notifications
WHERE studentID = 1042 AND status = false
ORDER BY createdAt DESC
LIMIT 50;
```

## Students with placement notifications in last 7 days

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
	AND createdAt >= NOW() - INTERVAL '7 days';
```

## Stage 4

## Suggested solution

- Fetch notifications only when the user opens the notifications view, not on every page load
- Use real time push using WebSocket for new notifications and keep the client in sync
- Cache recent notifications and unread counts in Redis

## Tradeoffs

- Push: needs persistent connections and more server complexity
- Cache: extra memory cost and cache invalidation complexity
