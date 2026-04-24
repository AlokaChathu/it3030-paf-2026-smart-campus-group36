# Booking Management API Samples

Base URL: `http://localhost:8090`

## Create Booking - `POST /api/bookings`

Request:

```json
{
  "resourceId": 1001,
  "startTime": "2026-05-10T09:00:00",
  "endTime": "2026-05-10T11:00:00",
  "purpose": "Student club orientation session",
  "attendees": 50
}
```

Response `201 Created`:

```json
{
  "success": true,
  "message": "Booking request created",
  "data": {
    "id": 1,
    "resourceId": 1001,
    "userId": "6808f16d5e98f2403fa2b7a1",
    "startTime": "2026-05-10T09:00:00",
    "endTime": "2026-05-10T11:00:00",
    "status": "PENDING",
    "purpose": "Student club orientation session",
    "attendees": 50,
    "rejectionReason": null,
    "createdAt": "2026-04-23T18:02:05.123"
  }
}
```

Conflict `400 Bad Request`:

```json
{
  "success": false,
  "message": "Selected time slot is unavailable for this resource"
}
```

## My Bookings - `GET /api/bookings/my`

Response `200 OK`:

```json
{
  "success": true,
  "message": "Bookings retrieved",
  "data": [
    {
      "id": 1,
      "resourceId": 1001,
      "userId": "6808f16d5e98f2403fa2b7a1",
      "startTime": "2026-05-10T09:00:00",
      "endTime": "2026-05-10T11:00:00",
      "status": "PENDING",
      "purpose": "Student club orientation session",
      "attendees": 50,
      "rejectionReason": null,
      "createdAt": "2026-04-23T18:02:05.123"
    }
  ]
}
```

## Admin Filtered List - `GET /api/bookings?resourceId=1001&date=2026-05-10&status=PENDING`

Response `200 OK`:

```json
{
  "success": true,
  "message": "Bookings retrieved",
  "data": [
    {
      "id": 1,
      "resourceId": 1001,
      "userId": "6808f16d5e98f2403fa2b7a1",
      "startTime": "2026-05-10T09:00:00",
      "endTime": "2026-05-10T11:00:00",
      "status": "PENDING",
      "purpose": "Student club orientation session",
      "attendees": 50,
      "rejectionReason": null,
      "createdAt": "2026-04-23T18:02:05.123"
    }
  ]
}
```

## Admin Approve/Reject - `PUT /api/bookings/{id}/status`

Approve request:

```json
{
  "status": "APPROVED"
}
```

Reject request:

```json
{
  "status": "REJECTED",
  "rejectionReason": "Room unavailable due to maintenance"
}
```

## Cancel Booking - `DELETE /api/bookings/{id}`

Response `200 OK`:

```json
{
  "success": true,
  "message": "Booking cancelled"
}
```
