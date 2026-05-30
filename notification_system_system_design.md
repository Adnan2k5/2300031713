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
