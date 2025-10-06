# Rannkly Task Management App

A MERN stack application for managing tasks within an organization. It includes role-based access control for Admins, Managers, and Employees.

## Setup/Installation Instructions

### Backend (Server)

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory and add the following environment variables:
    ```
    PORT=5000
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    ```
4.  Start the server:
    ```bash
    npm start
    ```

### Frontend (Client)

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the client:
    ```bash
    npm run dev
    ```

## Technologies Used

*   **Frontend:** React, Vite, Tailwind CSS, Context API
*   **Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose, JWT

## Test Accounts

To test the application, you can register new users with the following roles, or use the provided credentials if they have been seeded into the database.

*   **Admin:**
    *   **Email:** `admin@gmail.com`
    *   **Password:** `admin123`
*   **Manager:**
    *   **Email:** `manager@gmail.com.`
    *   **Password:** `manager123`
*   **Employee:**
    *   **Email:** `employee@gmail.com.`
    *   **Password:** `employee123`

**Note:** You will need to register these users first if they don't exist in the database. The application supports user registration.
