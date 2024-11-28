# RBAC Authentication and Authorization System

## Overview

This project implements a Role-Based Access Control (RBAC) system using **Node.js**, **TypeScript**, and **MongoDB**. The system allows for user registration, login, and logout, with role-based access control to ensure that users are only able to access resources based on their assigned role. The three roles in this system are:

- **Admin**: Can access all user details.
- **Moderator**: Can access only user and moderator details.
- **User**: Can access only their own user details.

The system uses **JWT (JSON Web Tokens)** for secure authentication, and **bcrypt** for password hashing to ensure secure login and registration.

## Features

- **User Authentication**: Secure login, registration, and session management with JWT.
- **Role-Based Access Control (RBAC)**: Different roles with specific permissions to access resources.
  - Admin can access all users' data.
  - Moderator can only access data of users and other moderators.
  - Users can only access their own data.
- **Authorization**: Ensures that users can only access the routes they are authorized to based on their roles.
- **Password Security**: Passwords are hashed using bcrypt for added security.

## Tech Stack

- **Node.js**: Server-side JavaScript runtime.
- **TypeScript**: Superset of JavaScript for type safety.
- **Express.js**: Web framework for building REST APIs.
- **MongoDB**: NoSQL database to store user data.
- **JWT (JSON Web Tokens)**: For session management and authentication.
- **bcryptjs**: To securely hash passwords.

## Installation

### Prerequisites

- **Node.js** (v14 or later)
- **MongoDB** (or MongoDB Atlas for a cloud-based solution)

### Steps to Install

1. **Clone the repository:**

   ```bash
   git clone <repository_url>
   cd <project_directory>
   ```
2. **Install dependencies:**

   ```bash
   npm install

   ```
3. **Set up MongoDB:**

   If using MongoDB locally, make sure the MongoDB server is running.
   For MongoDB Atlas, create a cluster and obtain your connection string.
4. **Environment variables:**
   Create a .env file in the root directory and add the following:

   ```bash
    DB_URL = <your_mongo_connection_string>
    PORT = 3000
    JWT_SECRET = <your_jwt_secret>
    EMAIL = <your_email> 
    EMAIL_PASSWORD = <your_password>
   ```
5. **Run the server:**

   ```bash
   npm run dev

   ```

## API Endpoints

### **Authentication**

#### **POST** `/api/auth/register`

Register a new user.

- **Request Body**:

  ```json
  {
    "username": "exampleuser",
    "email": "user@example.com",
    "password": "password123",
    "role":["admin", "moderator", "user"]
  }
  ```
- **Response**:

  ```json
  {
    "message": "User registered successfully"
  }
  ```
- **Description**: This endpoint allows users to proceed in the email-verification process.

#### **POST** `/api/auth/verify-user`

User with Valid Otp Verify themself and store the data into DB.

- **Request Body**:

  ```json
  {
    "otp":value
  }
  ```
- **Response**:

  ```json
  {
    success: true,
    message: "User successfully verified and registered! You can now log in.",
  }
  ```
- **Description**: This endpoint allows users to store their data into the DB.

#### **POST** `api/auth/login`

Login and obtain a JWT token.

- **Request Body**:

  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:

  ```json
  {
    "token": "jwt_token_here"
  }
  ```
- **Description**: This endpoint allows users to login using their email and password. Upon successful login, a **JWT token** is generated and stored as a cookie, which is required to authenticate further requests.

---

### **Protected Routes** (Requires JWT in the Authorization header)

#### **GET** `api/admin/getAllData`

Get a list of users, moderators and other admin. (Accessible by Admin only)

- **Headers**:

  ```json
  {
    "using cookie-parser to store token"
  }
  ```
- **Response**:

  ```json
  [
    {
      "email": "user_email",
      "username": "user1",
      "role": "User"
    },
    {
      "email": "moderator_email",
      "username": "moderator1",
      "role": "Moderator"
    }
  ]
  ```
- **Description**: This endpoint fetches the list of all users. **Admin** roles can access this endpoint, Admin can view all the users, moderators and other admin data.

#### **GET** `api/moderator/getAllModerators`

Get a list of users and moderators. (Accessible by Admin and moderators)

- **Headers**:

  ```json
  {
    "using cookie-parser to store token"
  }
  ```
- **Response**:

  ```json
  [
    {
      "email": "user_email",
      "username": "user1",
      "role": "User"
    },
    {
      "email": "moderator_email",
      "username": "moderator1",
      "role": "Moderator"
    }
  ]
  ```
- **Description**: This endpoint fetches the list of all users. **Moderators** and **Admin** roles can access this endpoint, Moderators and Admin can view all the users and moderators data.

#### **GET** `api/user/getAllUsers`

Get a list of users. (Accessible by Admin, moderators, and users)

- **Headers**:

  ```json
  {
    "using cookie-parser to store token"
  }
  ```
- **Response**:

  ```json
  [
    {
      "email": "user_email",
      "username": "user1",
      "role": "User"
    }
  ]
  ```
- **Description**: This endpoint fetches the list of all users. **Moderators**,  **Admin** and **User** roles can access this endpoint. User, Moderators, Admin can view all the users data.

### **Authorization Middleware**

All protected routes require an **Authorization header** containing a valid **JWT token**. The middleware verifies the token and ensures that the user has the correct role to access the requested resource.

- **Admin**: Can access all user data, including other admins, users, and moderators.
- **Moderator**: Can access user and moderator data, but not admin data.
- **User**: Can only access user profile data.

If a user tries to access a resource they are not authorized for, the API will respond with a `403 Forbidden` status code.


## File Hierarchy

Below is the structure of the project directory, including the key files and their purposes:
   ```bash

├── src 
│   ├── config
│   │   └── dbConnect.ts           # Database connection setup
│   ├── controllers
│   │   ├── adminController.ts     # Admin-related request handling
│   │   ├── authUser.ts           # Authentication-related logic
│   │   ├── moderatorController.ts # Moderator-related request handling
│   │   └── userController.ts      # User-related request handling
│   ├── middleware
│   │   ├── authMiddleware.ts      # Middleware for authentication
│   │   └── ratelimiterMiddleware.ts # Rate limiting middleware
│   ├── models
│   │   └── Users.ts               # User model (Mongoose schema)
│   ├── routes
│   │   ├── accessRoutes.ts        # Routes for access control
│   │   └── authRoutes.ts          # Routes for authentication
│   ├── utils
│   │   └── sendMail.ts            # Utility for sending emails
│   └── index.ts                   # Main entry point to the app
├── .gitignore                    # Specifies files and directories to be ignored by Git
├── package-lock.json              # Automatically generated file that locks down dependencies
├── package.json                  # Project metadata and dependencies
├── README.md                     # Project documentation
└── tsconfig.json                 # TypeScript configuration file
```


### Explanation of Key Files and Folders

- **`src/controllers/`**: Contains controller files that handle the logic for various types of users.
  - `adminController.ts`: Manages routes specific to Admin users.
  - `authUser.ts`: Handles user authentication (login, register).
  - `moderatorController.ts`: Handles routes specific to Moderator users.
  - `userController.ts`: Manages user-specific routes.

- **`src/middleware/`**: Contains middleware for various functionalities.
  - `authMiddleware.ts`: Checks if the request has a valid JWT token and handles user authentication.
  - `ratelimiterMiddleware.ts`: Implements rate-limiting to prevent abuse (too many requests from the same user/IP).

- **`src/models/`**: Contains Mongoose models to interact with the MongoDB database.
  - `Users.ts`: Defines the user schema and model for managing user data.

- **`src/routes/`**: Defines API routes for authentication and resource access.
  - `accessRoutes.ts`: Defines routes for users with different access levels (Admin, Moderator, User).
  - `authRoutes.ts`: Contains routes for handling user authentication (login, register).

- **`src/services/`**: Contains business logic related to various operations.
  - `userService.ts`: Includes functions for user registration, login, and user-related operations.

- **`src/utils/`**: Contains utility functions used throughout the application.
  - `sendMail.ts`: A utility function to send emails (such as for password resets or user registration).

- **`src/app.ts`**: The main application setup file, which initializes the Express server, connects routes, and applies middleware.

### Other Important Files

- **`.env`**: Contains environment-specific variables such as the MongoDB connection string and JWT secret key.
- **`package.json`**: Contains metadata about the project, such as dependencies, scripts, and project information.
- **`tsconfig.json`**: Configuration file for TypeScript, defining compiler options and file includes.
- **`README.md`**: This file contains project documentation.

