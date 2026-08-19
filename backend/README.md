# API ENDPOINTS WITH RESPONSE 

## HealthCheck API 
>> GET => (http://localhost:5001/api/health)

```
{
    "success": true,
    "message": "API is running"
}
```

## Register API

>> POST (http://localhost:5001/api/auth/register)

```
{
    "success": true,
    "message": "Registration successful.",
    "data": {
        "user": {
            "_id": "6a857a40c202977c99891ee6",
            "name": "shivansh",
            "email": "shivansh@gmail.com",
            "role": "customer",
            "createdAt": "2026-08-19T09:41:20.971Z",
            "updatedAt": "2026-08-19T09:41:20.971Z",
            "__v": 0
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhODU3YTQwYzIwMjk3N2M5OTg5MWVlNiIsImlhdCI6MTc4NzEzMjQ4MSwiZXhwIjoxNzg3NzM3MjgxfQ.Qr9Ed40QZASOYiDUmI-R9L-_283-fbBVdfu1p5xVZzU"
    }
}
```

## Login API

>> POST (http://localhost:5001/api/auth/login)

```
{
    "success": true,
    "message": "Login successful.",
    "data": {
        "user": {
            "_id": "6a857a40c202977c99891ee6",
            "name": "shivansh",
            "email": "shivansh@gmail.com",
            "role": "customer",
            "createdAt": "2026-08-19T09:41:20.971Z",
            "updatedAt": "2026-08-19T09:41:20.971Z",
            "__v": 0
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhODU3YTQwYzIwMjk3N2M5OTg5MWVlNiIsImlhdCI6MTc4NzEzMjg0OCwiZXhwIjoxNzg3NzM3NjQ4fQ.Cf-wjVQxsqBs7erAer4VGvW_rPfEiXZWL-NcD1s9gak"
    }
}
```

## Logout API

>> POST (http://localhost:5001/api/auth/logout)

```
{
    "success": true,
    "message": "Logout successful. Remove the token on the client.",
    "data": {}
}
```

## Get Profile API

>> GET (http://localhost:5001/api/auth/me)

```
{
    "success": true,
    "message": "Authenticated user fetched successfully.",
    "data": {
        "user": {
            "_id": "6a857a40c202977c99891ee6",
            "name": "shivansh",
            "email": "shivansh@gmail.com",
            "role": "customer",
            "createdAt": "2026-08-19T09:41:20.971Z",
            "updatedAt": "2026-08-19T09:41:20.971Z",
            "__v": 0
        }
    }
}
```

## Get Admin Check API

>> POST (http://localhost:5001/api/auth/admin-check)

- because we are register as costumer
```
{
    "success": false,
    "message": "Admin access is required.",
    "errors": []
}
```

