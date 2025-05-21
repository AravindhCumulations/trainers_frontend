# API Endpoints Used in the Codebase

## 1. Get Trainer Details
- **Endpoint:** `GET http://3.94.205.118:8000/api/resource/Trainer/{trainer_id}`
- **Headers:**
  - Authorization: `token a6d10becfd9dfd8:e0881f66419822c`
  - Content-Type: `application/json`
- **Request Example:**
  ```http
  GET http://3.94.205.118:8000/api/resource/Trainer/TRAINER_ID
  Authorization: token a6d10becfd9dfd8:e0881f66419822c
  Content-Type: application/json
  ```
- **Expected Response:**
  ```json
  {
    "data": {
      // Trainer object fields
    }
  }
  ```

---

## 2. Get User Credits
- **Endpoint:** `GET /api/resource/Credits?fields=["credits"]&filters={"user": "user@email.com"}`
- **Headers:**
  - Authorization: `token a6d10becfd9dfd8:e0881f66419822c`
  - Content-Type: `application/json`
- **Request Example:**
  ```http
  GET /api/resource/Credits?fields=["credits"]&filters={"user": "user@email.com"}
  Authorization: token a6d10becfd9dfd8:e0881f66419822c
  Content-Type: application/json
  ```
- **Expected Response:**
  ```json
  {
    "data": [
      { "credits": 300 }
    ]
  }
  ```

---

## 3. Create Checkout Session (Buy Credits)
- **Endpoint:** `POST http://3.94.205.118:8000/api/method/trainer.api.create_checkout_session?amount={amount}`
- **Headers:**
  - Authorization: `token a6d10becfd9dfd8:e0881f66419822c`
  - Content-Type: `application/json`
- **Request Example:**
  ```http
  POST http://3.94.205.118:8000/api/method/trainer.api.create_checkout_session?amount=100
  Authorization: token a6d10becfd9dfd8:e0881f66419822c
  Content-Type: application/json
  ```
- **Expected Response:**
  ```json
  {
    "message": {
      "session_id": "SESSION_ID",
      "redirect_url": "https://payment-redirect-url.com",
      // or error message
      "error": "Error message if any"
    }
  }
  ```

---

## 4. Login
- **Endpoint:** `POST http://3.94.205.118:8000/api/method/login`
- **Headers:**
  - Content-Type: `application/json`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "userpassword"
  }
  ```
- **Expected Response:**
  ```json
  {
    "message": {
      "user": {
        "email": "user@example.com",
        "role": "trainer" | "company",
        "companyName": "Company Name",
        "isFirstLogin": true
      },
      "token": "auth_token"
    }
  }
  ```

---

## 5. Signup
- **Endpoint:** `POST http://3.94.205.118:8000/api/method/signup`
- **Headers:**
  - Content-Type: `application/json`
- **Request Body:**
  ```json
  {
    "role": "trainer" | "company",
    "companyName": "Company Name",
    "email": "user@example.com",
    "password": "userpassword"
  }
  ```
- **Expected Response:**
  ```json
  {
    "message": {
      "user": {
        "role": "trainer" | "company",
        "companyName": "Company Name",
        "email": "user@example.com",
        "isFirstLogin": true
      }
    }
  }
  ```

---

# Notes
- All endpoints require the Authorization header with a token, except for login and signup.
- The `/api/resource/Credits` endpoint is proxied via Next.js (see `next.config.ts`), so it can be called as a relative path from the frontend.
- The actual structure of the Trainer object and other responses may include more fields depending on backend implementation.
- Login and signup endpoints are currently mocked in the frontend code and need to be connected to actual backend endpoints. 