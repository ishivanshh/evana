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

# PRODUCT API RESPONSES 

## Create Product API

>> POST (http://localhost:5001/api/products) 

>>JSON BODY 
```
{
    "name": "Rose Garden Candle",
    "description": "A delicate rose-scented soy wax candle that brings a romantic and refreshing floral aroma to any room.",
    "price": 849,
    "discountPrice": 649,
    "category": "6a8596e362554d2022386da4",
    "images": [
      "https://example.com/images/rose-candle-1.jpg",
      "https://example.com/images/rose-candle-2.jpg"
    ],
    "stock": 42,
    "sku": "ROS-CND-002",
    "scent": "Rose",
    "waxType": "Soy Wax",
    "burnTime": 40,
    "size": "200g",
    "isFeatured": true,
    "isBestSeller": false,
    "isActive": true
}
```
>> RESPONSE
```
{
    "success": true,
    "message": "Product created successfully.",
    "data": {
        "_id": "6a85a98162554d2022386db9",
        "name": "Rose Garden Candle",
        "description": "A delicate rose-scented soy wax candle that brings a romantic and refreshing floral aroma to any room.",
        "price": 849,
        "discountPrice": 649,
        "category": {
            "_id": "6a8596e362554d2022386da4",
            "name": "Aromatic Candles",
            "description": "Premium scented candles designed to create a relaxing and pleasant atmosphere.",
            "createdAt": "2026-08-19T11:43:31.870Z",
            "updatedAt": "2026-08-19T11:43:31.870Z",
            "slug": "aromatic-candles",
            "__v": 0
        },
        "images": [
            "https://example.com/images/rose-candle-1.jpg",
            "https://example.com/images/rose-candle-2.jpg"
        ],
        "stock": 42,
        "sku": "ROS-CND-002",
        "scent": "Rose",
        "waxType": "Soy Wax",
        "burnTime": 40,
        "size": "200g",
        "isFeatured": true,
        "isBestSeller": false,
        "isActive": true,
        "rating": 0,
        "numReviews": 0,
        "createdAt": "2026-08-19T13:02:57.077Z",
        "updatedAt": "2026-08-19T13:02:57.077Z",
        "slug": "rose-garden-candle",
        "__v": 0
    }
}
```

## GET ALL THE PRODUCTS LISTED 
>> GET(http://localhost:5001/api/products)

>> RESPONSE 
```
{
    "success": true,
    "message": "Products retrieved successfully.",
    "data": {
        "products": [
            {
                "_id": "6a85aabd62554d2022386dc0",
                "name": "Sandalwood Serenity Candle",
                "description": "A rich sandalwood-scented soy wax candle designed to create a calm and peaceful environment.",
                "price": 999,
                "discountPrice": 799,
                "category": {
                    "_id": "6a8596e362554d2022386da4",
                    "name": "Aromatic Candles",
                    "description": "Premium scented candles designed to create a relaxing and pleasant atmosphere.",
                    "createdAt": "2026-08-19T11:43:31.870Z",
                    "updatedAt": "2026-08-19T11:43:31.870Z",
                    "slug": "aromatic-candles",
                    "__v": 0
                },
                "images": [
                    "https://example.com/images/sandalwood-candle-1.jpg",
                    "https://example.com/images/sandalwood-candle-2.jpg"
                ],
                "stock": 28,
                "sku": "SAN-CND-003",
                "scent": "Sandalwood",
                "waxType": "Soy Wax",
                "burnTime": 50,
                "size": "250g",
                "isFeatured": true,
                "isBestSeller": true,
                "isActive": true,
                "rating": 0,
                "numReviews": 0,
                "createdAt": "2026-08-19T13:08:13.876Z",
                "updatedAt": "2026-08-19T13:08:13.876Z",
                "slug": "sandalwood-serenity-candle",
                "__v": 0
            },
            {
                "_id": "6a85a98162554d2022386db9",
                "name": "Rose Garden Candle",
                "description": "A delicate rose-scented soy wax candle that brings a romantic and refreshing floral aroma to any room.",
                "price": 849,
                "discountPrice": 649,
                "category": {
                    "_id": "6a8596e362554d2022386da4",
                    "name": "Aromatic Candles",
                    "description": "Premium scented candles designed to create a relaxing and pleasant atmosphere.",
                    "createdAt": "2026-08-19T11:43:31.870Z",
                    "updatedAt": "2026-08-19T11:43:31.870Z",
                    "slug": "aromatic-candles",
                    "__v": 0
                },
                "images": [
                    "https://example.com/images/rose-candle-1.jpg",
                    "https://example.com/images/rose-candle-2.jpg"
                ],
                "stock": 42,
                "sku": "ROS-CND-002",
                "scent": "Rose",
                "waxType": "Soy Wax",
                "burnTime": 40,
                "size": "200g",
                "isFeatured": true,
                "isBestSeller": false,
                "isActive": true,
                "rating": 0,
                "numReviews": 0,
                "createdAt": "2026-08-19T13:02:57.077Z",
                "updatedAt": "2026-08-19T13:02:57.077Z",
                "slug": "rose-garden-candle",
                "__v": 0
            },
            {
                "_id": "6a8596f362554d2022386da9",
                "name": "Vanilla Dream Candle",
                "description": "A warm vanilla-scented soy wax candle that creates a cozy and comforting atmosphere.",
                "price": 899,
                "discountPrice": 699,
                "category": {
                    "_id": "6a8596e362554d2022386da4",
                    "name": "Aromatic Candles",
                    "description": "Premium scented candles designed to create a relaxing and pleasant atmosphere.",
                    "createdAt": "2026-08-19T11:43:31.870Z",
                    "updatedAt": "2026-08-19T11:43:31.870Z",
                    "slug": "aromatic-candles",
                    "__v": 0
                },
                "images": [
                    "https://example.com/images/vanilla-candle-1.jpg",
                    "https://example.com/images/vanilla-candle-2.jpg"
                ],
                "stock": 35,
                "sku": "VAN-CND-002",
                "scent": "Vanilla",
                "waxType": "Soy Wax",
                "burnTime": 45,
                "size": "250g",
                "isFeatured": true,
                "isBestSeller": true,
                "isActive": true,
                "rating": 0,
                "numReviews": 0,
                "createdAt": "2026-08-19T11:43:47.185Z",
                "updatedAt": "2026-08-19T11:43:47.185Z",
                "slug": "vanilla-dream-candle",
                "__v": 0
            }
        ],
        "pagination": {
            "total": 3,
            "limit": 10,
            "page": 1,
            "pages": 1,
            "hasNextPage": false,
            "hasPrevPage": false
        }
    }
}
```

## UPDATE PRODUCT WITH ID

>> PUT(http://localhost:5001/api/products/:id)

>> JSON BODY
```
{
  "name": "Vanilla Dream Premium Candle",
  "description": "A premium vanilla-scented soy wax candle that creates a warm, cozy, and relaxing atmosphere.",
  "price": 999,
  "discountPrice": 749,
  "category": "6a8596e362554d2022386da4",
  "images": [
    "https://example.com/images/vanilla-premium-1.jpg",
    "https://example.com/images/vanilla-premium-2.jpg"
  ],
  "stock": 45,
  "sku": "VAN-CND-001",
  "scent": "French Vanilla",
  "waxType": "Soy Wax",
  "burnTime": 50,
  "size": "300g",
  "isFeatured": true,
  "isBestSeller": true,
  "isActive": true
}
```
>> RESPONSE 

```
{
    "success": true,
    "message": "Product updated successfully.",
    "data": {
        "_id": "6a85aabd62554d2022386dc0",
        "name": "Vanilla Dream Premium Candle",
        "description": "A premium vanilla-scented soy wax candle that creates a warm, cozy, and relaxing atmosphere.",
        "price": 999,
        "discountPrice": 749,
        "category": {
            "_id": "6a8596e362554d2022386da4",
            "name": "Aromatic Candles",
            "description": "Premium scented candles designed to create a relaxing and pleasant atmosphere.",
            "createdAt": "2026-08-19T11:43:31.870Z",
            "updatedAt": "2026-08-19T11:43:31.870Z",
            "slug": "aromatic-candles",
            "__v": 0
        },
        "images": [
            "https://example.com/images/vanilla-premium-1.jpg",
            "https://example.com/images/vanilla-premium-2.jpg"
        ],
        "stock": 45,
        "sku": "VAN-CND-001",
        "scent": "French Vanilla",
        "waxType": "Soy Wax",
        "burnTime": 50,
        "size": "300g",
        "isFeatured": true,
        "isBestSeller": true,
        "isActive": true,
        "rating": 0,
        "numReviews": 0,
        "createdAt": "2026-08-19T13:08:13.876Z",
        "updatedAt": "2026-08-19T13:24:54.097Z",
        "slug": "vanilla-dream-premium-candle",
        "__v": 1
    }
}
```


## DELETE A PRODUCT WITH ID

>> DELETE(http://localhost:5001/api/products/:id)

>> RESPONSE 
```
{
    "success": true,
    "message": "Product deleted successfully.",
    "data": {
        "_id": "6a85aabd62554d2022386dc0",
        "name": "Vanilla Dream Premium Candle",
        "description": "A premium vanilla-scented soy wax candle that creates a warm, cozy, and relaxing atmosphere.",
        "price": 999,
        "discountPrice": 749,
        "category": {
            "_id": "6a8596e362554d2022386da4",
            "name": "Aromatic Candles",
            "description": "Premium scented candles designed to create a relaxing and pleasant atmosphere.",
            "createdAt": "2026-08-19T11:43:31.870Z",
            "updatedAt": "2026-08-19T11:43:31.870Z",
            "slug": "aromatic-candles",
            "__v": 0
        },
        "images": [
            "https://example.com/images/vanilla-premium-1.jpg",
            "https://example.com/images/vanilla-premium-2.jpg"
        ],
        "stock": 45,
        "sku": "VAN-CND-001",
        "scent": "French Vanilla",
        "waxType": "Soy Wax",
        "burnTime": 50,
        "size": "300g",
        "isFeatured": true,
        "isBestSeller": true,
        "isActive": true,
        "rating": 0,
        "numReviews": 0,
        "createdAt": "2026-08-19T13:08:13.876Z",
        "updatedAt": "2026-08-19T13:24:54.097Z",
        "slug": "vanilla-dream-premium-candle",
        "__v": 1
    }
}
```





# CATEGORY API RESPONSES

## create categories API

>> POST(http://localhost:5001/api/categories)

>> JSON BODY
```
{
  "name": "Aromatic Candles",
  "description": "Premium scented candles designed to create a relaxing and pleasant atmosphere."
}
```

```
{
    "success": true,
    "message": "Category created successfully.",
    "data": {
        "name": "Aromatic Candles",
        "description": "Premium scented candles designed to create a relaxing and pleasant atmosphere.",
        "_id": "6a8596e362554d2022386da4",
        "createdAt": "2026-08-19T11:43:31.870Z",
        "updatedAt": "2026-08-19T11:43:31.870Z",
        "slug": "aromatic-candles",
        "__v": 0
    }
}
```