# API Usage Guide

Base URL: `http://localhost:8000/api/v1`

---

## Authentication

Most endpoints require a Bearer JWT token.

### Login

```bash
curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

Response:

```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIs..."
}
```

Use the token in subsequent requests:

```bash
TOKEN="<accessToken>"
curl -s "$BASE_URL/users" -H "Authorization: Bearer $TOKEN"
```

### Register

```bash
curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Nguyễn Văn A",
    "email": "user@example.com",
    "password": "password123",
    "phone": "0901234567",
    "avatar": "https://example.com/avatar.jpg",
    "vipTier": 0
  }'
```

| Field | Type | Required | Note |
|---|---|---|---|
| `fullName` | string | ✅ | |
| `email` | string | ✅ | |
| `password` | string | ✅ | Min 8 characters |
| `phone` | string | | |
| `avatar` | string | | URL |
| `vipTier` | number | | `0` (Free), `1`, `2`, `3` |

---

## Security Scheme

All protected endpoints use:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## Server

### Health Check (Sync)

```bash
curl -s "$BASE_URL/"
```

Response: `200`

### Health Check (Async)

```bash
curl -s "$BASE_URL/health"
```

Response: `200`

```json
{
  "status": "ok",
  "info": { "database": { "status": "up" } },
  "error": {},
  "details": { "database": { "status": "up" } }
}
```

---

## Users

### List Users

```bash
curl -s "$BASE_URL/users" \
  -H "Authorization: Bearer $TOKEN"
```

Query params: `?page=1&perPage=10`

### Get User by ID

```bash
curl -s "$BASE_URL/users/{id}" \
  -H "Authorization: Bearer $TOKEN"
```

### Update User

```bash
curl -s -X PATCH "$BASE_URL/users/{id}" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fullName": "Nguyễn Văn B"}'
```

| Field | Type | Note |
|---|---|---|
| `fullName` | string | |
| `email` | string | |
| `password` | string | |
| `phone` | string | |
| `avatar` | string | URL |
| `role` | number | `1`, `3`, `7`, `15` |

### Delete User (Soft)

```bash
curl -s -X DELETE "$BASE_URL/users/{id}" \
  -H "Authorization: Bearer $TOKEN"
```

### Restore User

```bash
curl -s -X POST "$BASE_URL/users/{id}/restore" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Properties

### Search Properties

```bash
curl -s "$BASE_URL/properties" \
  -H "Authorization: Bearer $TOKEN"
```

Query params:

| Param | Type | Example |
|---|---|---|
| `page` | integer | `1` |
| `perPage` | integer | `10` |
| `title` | string | `chung cư` |
| `type` | `sale` / `rent` | `sale` |
| `minPrice` | number | `1000000` |
| `maxPrice` | number | `5000000000` |
| `minArea` | number | `30` |
| `maxArea` | number | `200` |
| `address` | string | `Đường Nguyễn Huệ` |
| `district` | string | `Quận 1` |
| `province` | string | `TP.HCM` |
| `direction` | string | `Đông Nam` |
| `status` | `pending` / `active` / `sold` / `rented` / `hidden` / `draft` | `active` |

### Get Property by ID

```bash
curl -s "$BASE_URL/properties/{id}" \
  -H "Authorization: Bearer $TOKEN"
```

### Compare Properties

```bash
curl -s "$BASE_URL/properties/compare?ids=id1,id2,id3" \
  -H "Authorization: Bearer $TOKEN"
```

### Create Property

```bash
curl -s -X POST "$BASE_URL/properties" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Chung cư cao cấp",
    "description": "Chung cư đẹp, view sông",
    "type": "sale",
    "price": 2000000000,
    "area": 75,
    "address": "123 Đường Nguyễn Huệ, Quận 1, TP.HCM",
    "district": "Quận 1",
    "province": "TP.HCM",
    "coordinates": { "lat": 10.7769, "lng": 106.7009 },
    "images": ["https://example.com/img.jpg"],
    "direction": "Đông Nam",
    "legalInfo": "Sổ hồng chính chủ"
  }'
```

| Field | Type | Required |
|---|---|---|
| `title` | string | ✅ |
| `description` | string | ✅ |
| `type` | `sale` / `rent` | ✅ |
| `price` | number | ✅ |
| `area` | number | ✅ |
| `address` | string | ✅ |
| `coordinates` | `{ lat, lng }` | ✅ |
| `district` | string | |
| `province` | string | |
| `images` | string[] | |
| `direction` | string | |
| `legalInfo` | string | |

### Update Property

```bash
curl -s -X PATCH "$BASE_URL/properties/{id}" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}'
```

### Update Property Status

```bash
curl -s -X PUT "$BASE_URL/properties/{id}/status" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "active"}'
```

Status values: `pending`, `active`, `sold`, `rented`, `hidden`, `draft`

### Delete Property

```bash
curl -s -X DELETE "$BASE_URL/properties/{id}" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Wallet

### Get Balance

```bash
curl -s "$BASE_URL/wallet/balance" \
  -H "Authorization: Bearer $TOKEN"
```

### Deposit

```bash
curl -s -X POST "$BASE_URL/wallet/deposit" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 100000}'
```

### Pay

```bash
curl -s -X POST "$BASE_URL/wallet/pay" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 50000}'
```

### Get Transaction History

```bash
curl -s "$BASE_URL/wallet/history" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Interactions

### Toggle Favorite

```bash
curl -s -X POST "$BASE_URL/interactions/favorite/{propertyId}" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Favorites

```bash
curl -s "$BASE_URL/interactions/favorites" \
  -H "Authorization: Bearer $TOKEN"
```

Query params: `?page=1&perPage=10`

---

## Admin

### List All Users

```bash
curl -s "$BASE_URL/admin/users" \
  -H "Authorization: Bearer $TOKEN"
```

Query params: `?page=1&perPage=10`

### Create User (with Role)

```bash
curl -s -X POST "$BASE_URL/admin/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Nguyễn Văn A",
    "email": "user@example.com",
    "password": "password123",
    "phone": "0901234567",
    "avatar": "https://example.com/avatar.jpg",
    "vipTier": 0,
    "role": 1
  }'
```

| Role | Value |
|---|---|
| Customer | `1` |
| Merchant | `3` |
| Admin | `7` |
| Super Admin | `15` |

### Get Pending Properties

```bash
curl -s "$BASE_URL/admin/properties/pending" \
  -H "Authorization: Bearer $TOKEN"
```

### Approve Property

```bash
curl -s -X PUT "$BASE_URL/admin/properties/{id}/approve" \
  -H "Authorization: Bearer $TOKEN"
```

### Reject Property

```bash
curl -s -X PUT "$BASE_URL/admin/properties/{id}/reject" \
  -H "Authorization: Bearer $TOKEN"
```

### Get System Statistics

```bash
curl -s "$BASE_URL/admin/statistics" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Upload

### Upload Property Image

```bash
curl -s -X POST "$BASE_URL/upload/property/{propertyId}/image" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/image.jpg"
```

### Delete Property Image

```bash
curl -s -X DELETE "$BASE_URL/upload/property/image" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"key": "property-images/xxx.jpg"}'
```

---

## Windows PowerShell Notes

`curl` in PowerShell is an alias for `Invoke-WebRequest`. Use `curl.exe` for the real curl, and write request bodies to a temp file to avoid JSON quoting issues:

```powershell
$TOKEN = "<token>"
Set-Content -Path "$env:TEMP\body.json" -NoNewline -Value '{"email":"admin@example.com","password":"admin123"}'
curl.exe -s -X POST "http://localhost:8000/api/v1/auth/login" -H "Content-Type: application/json" -d "@$env:TEMP\body.json"
```
