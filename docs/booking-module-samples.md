# Module B - Booking Management (Sample API Responses)

## Create Booking - `POST /api/bookings`

### Request Body

```json
{
  "resourceId": 101,
  "startTime": "2026-04-28T09:00:00",
  "endTime": "2026-04-28T11:00:00",
  "purpose": "Final year project presentation practice",
  "attendees": 12
}
```

### `201 Created`

```json
{
  "id": "680b9d4ea2f77f4f7cdd8f30",
  "resourceId": 101,
  "userId": "6801fcb9b7df6a36f80fd8f9",
  "startTime": "2026-04-28T09:00:00",
  "endTime": "2026-04-28T11:00:00",
  "status": "PENDING",
  "purpose": "Final year project presentation practice",
  "attendees": 12,
  "rejectionReason": null,
  "createdAt": "2026-04-25T22:25:41.772"
}
```

### `409 Conflict` (Overlapping approved booking)

```json
{
  "success": false,
  "message": "Selected time slot conflicts with an approved booking.",
  "data": null
}
```

## My Bookings - `GET /api/bookings/my`

### `200 OK`

```json
[
  {
    "id": "680b9d4ea2f77f4f7cdd8f30",
    "resourceId": 101,
    "userId": "6801fcb9b7df6a36f80fd8f9",
    "startTime": "2026-04-28T09:00:00",
    "endTime": "2026-04-28T11:00:00",
    "status": "PENDING",
    "purpose": "Final year project presentation practice",
    "attendees": 12,
    "rejectionReason": null,
    "createdAt": "2026-04-25T22:25:41.772"
  }
]
```

## Admin Booking Query - `GET /api/bookings?resourceId=101&date=2026-04-28&status=PENDING`

### `200 OK`

```json
[
  {
    "id": "680b9d4ea2f77f4f7cdd8f30",
    "resourceId": 101,
    "userId": "6801fcb9b7df6a36f80fd8f9",
    "startTime": "2026-04-28T09:00:00",
    "endTime": "2026-04-28T11:00:00",
    "status": "PENDING",
    "purpose": "Final year project presentation practice",
    "attendees": 12,
    "rejectionReason": null,
    "createdAt": "2026-04-25T22:25:41.772"
  }
]
```

## Update Status - `PUT /api/bookings/{id}/status`

### Approve Request Body

```json
{
  "status": "APPROVED"
}
```

### Reject Request Body

```json
{
  "status": "REJECTED",
  "rejectionReason": "Resource requires maintenance during requested slot."
}
```

## Cancel Booking - `DELETE /api/bookings/{id}`

### `200 OK`

```json
{
  "success": true,
  "message": "Booking cancelled successfully.",
  "data": null
}
```

## Unavailable Slots (Bonus) - `GET /api/bookings/unavailable?resourceId=101&date=2026-04-28`

### `200 OK`

```json
[
  {
    "startTime": "2026-04-28T13:00:00",
    "endTime": "2026-04-28T15:00:00"
  }
]
```
