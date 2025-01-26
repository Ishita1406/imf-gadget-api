# Gadget Management API

This project is a backend API for managing gadgets, including functionalities like creating, updating, deleting gadgets, self-destructing gadgets, and user authentication. The API also includes a secure authentication mechanism using JWT tokens.

## Features

- **Gadget Management**: Create, update, get, delete, and self-destruct gadgets.
- **User Authentication**: Register and login users with JWT-based authentication.
- **Mission Success Probability**: Generates a success probability for each gadget.
- **Codename Generator**: Randomly generates unique codenames for each gadget.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL (with mysql2 for connection)
- **Authentication**: JWT (JSON Web Token)
- **Password Encryption**: bcryptjs
- **Environment Variables**: dotenv for managing sensitive data

## Setup

### Prerequisites

- Node.js (v14 or above)
- MySQL Database
- .env file for environment variables (`JWT_SECRET`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT`)

### Installation

1. Install dependencies:

    ```bash
    npm install
    ```

2. Create a `.env` file in the root directory with the following variables:

    ```env
    DB_HOST=your-database-host
    DB_USER=your-database-username
    DB_PASSWORD=your-database-password
    DB_NAME=your-database-name
    JWT_SECRET=your-secret-key
    PORT=your-port
    ```

3. Start the server:

    ```bash
    npm start
    ```
## API Endpoints

### User Authentication

- **POST /auth/register**: Register a new user  
    **Body**: `{ "username": "your-username", "password": "your-password" }`  
    **Response**: `{ "user_id": "uuid", "username": "your-username", "created_at": "timestamp" }`

- **POST /auth/login**: Login and receive a JWT token  
    **Body**: `{ "username": "your-username", "password": "your-password" }`  
    **Response**: `{ "user_id": "uuid", "username": "your-username", "token": "JWT_TOKEN" }`

    You can use tools like Postman or cURL to register and log in, and get the JWT token.

### Gadget Management

- **GET /gadgets**: Get a list of all gadgets or filter by status (optional)  
    **Query Parameters**:
    - `status={status}` (optional) — Filter by gadget status (e.g., status=available)
    - `token={your-jwt-token}` (required) — Pass the JWT token to authenticate  
    **Response**:

    ```json
    [
      { 
        "id": "uuid",
        "name": "Gadget Name",
        "codename": "The Phantom Lion",
        "status": "available",
        "mission_success_probability": "75%"
      }
    ]
    ```

- **POST /gadgets/create**: Create a new gadget  
    **Body**: `{ "name": "Gadget Name", "status": "available" }`  
    **Response**:

    ```json
    {
      "id": "uuid",
      "name": "Gadget Name",
      "codename": "The Phantom Lion",
      "status": "available",
      "created_at": "timestamp",
      "updated_at": "timestamp",
      "mission_success_probability": "75%"
    }
    ```

- **PATCH /gadgets/update/:id**: Update gadget details  
    **Body**: `{ "name": "Updated Gadget Name", "status": "deployed" }`  
    **Response**: `{ "message": "Gadget updated successfully" }`

- **DELETE /gadgets/delete/:id**: Decommission a gadget (soft delete)  
    **Response**: `{ "message": "Gadget successfully decommissioned" }`

- **POST /gadgets/:id/self-destruct**: Initiate self-destruct for a gadget  
    **Response**: `{ "message": "Self-destruct initiated", "confirmationCode": "unique-confirmation-code" }`

## Authentication

To access the gadget management routes, you need to be authenticated. Follow these steps:

1. Register a User using the `/auth/register` endpoint to create a user.
2. Login using the `/auth/login` endpoint to get the JWT token.
3. Use the token in subsequent requests to access gadget-related endpoints.

### Example Request to Get Gadgets

Once you have the JWT token from the `/auth/login` endpoint, include it in your requests to the gadget routes.

Example URL: `/gadgets/token?{token}`  
Example with filter for status: `/gadgets/token?{token}&status=deployed`

## Database Schema

### `gadgets` Table

| Column                        | Type         | Description                                      |
|-------------------------------|--------------|--------------------------------------------------|
| `id`                           | UUID         | Unique identifier for the gadget                 |
| `name`                         | VARCHAR(255)  | Name of the gadget                               |
| `codename`                     | VARCHAR(255)  | Unique codename for the gadget                   |
| `status`                       | ENUM         | Status of the gadget (e.g., 'available', 'decommissioned') |
| `created_at`                   | DATETIME     | Timestamp of when the gadget was created         |
| `updated_at`                   | DATETIME     | Timestamp of when the gadget was last updated    |
| `decommissioned_at`            | DATETIME     | Timestamp of when the gadget was decommissioned  |
| `mission_success_probability`  | VARCHAR(10)   | Probability of success for the gadget's mission (e.g., '75%') |

### `user` Table

| Column        | Type         | Description                                 |
|---------------|--------------|---------------------------------------------|
| `user_id`     | UUID         | Unique identifier for the user             |
| `username`    | VARCHAR(255)  | Username for the user                      |
| `password`    | VARCHAR(255)  | Encrypted password                         |
| `created_at`  | DATETIME     | Timestamp of when the user registered      |
