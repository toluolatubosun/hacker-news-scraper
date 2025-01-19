# Hacker News Scraper

This is an application that does the following:
- Periodically scrapes the latest posts on Hacker News and stores them in a database
- Alerts active users in real-time when a new post is added on Hacker News via a web socket connection
- Sends the number of new posts within the last 5 minutes to the client via a web socket connection (only on initial connection)
- Provides an API for basic CRUD operations
  - Register a new user
  - Login a user
  - Logout a user
  - Refresh a user's token
  - Get Logged in user

# Backend

## Technologies Used

- Node.js
- Prisma
- PostgreSQL
- Express.js
- Socket.io
- Bruno

## Setting Up Prisma

Ensure you have the `DATABASE_URL` environment variable set in a `.env` file in the root of the project, which is the connection string to your database.

```.env
# If you are using the database in a docker container, you can use the following connection string

DATABASE_URL="postgresql://postgres:password@localhost:5420/hacker-news-scraper"
```

To run the docker compose file, run the following command:

````bash
docker-compose up -d
````

```bash
# Install Prisma 
# **You don't need to run this command since the prisma folder is already created
npx prisma init

# Generate Prisma Client
npx prisma generate

# Run existing migrations
npx prisma migrate dev

# Create a new migration
# **If you make changes to the schema.prisma file, you need to create a new migration
npx prisma migrate dev --name init
```

## Database Content

To fill the database with seed data, run the following command:

```bash
yarn prisma:seed
```

In this implementation, it creates a default user with the following credentials, for testing purposes:

- email: `default.user@hackernews.com`
- password: `password`


## Running the Backend

```bash
# Install dependencies
yarn install

# Start the development server
yarn dev
```

The backend server will be running on `http://localhost:4000`.

## API Documentation

The API documentation can be found in ./backend/api-client-docs. The documentation was generated using Bruno

# Usage Guide

When working with the API, the websocket connection is protected. To connect to the websocket, you need to provide a valid token. The token can be obtained by logging in or registering a new user.

To register make an HTTP POST request to `http://localhost:4000/v1/auth/register` with the following payload:

```json
{
  "name": "New User",
  "email": "new.user@hackernews.com",
  "password": "password"
}
```

To login make an HTTP POST request to `http://localhost:4000/v1/auth/login` with the following payload:

```json
{
  "email": "new.user@hackernews.com",
  "password": "password"
}
```

Both Login and Register Return the same response:

```json
{
  "message": "user login successful",
  "data": {
    "user": {
      "id": "cm63vp1fi0000ue3gblxc1afy",
      "role": "USER",
      "name": "Default User",
      "email": "default.user@hackernews.com",
      "password": "$2a$10$r6ruKLOoCFsPM82BijqAE.XKMskIu8YegoSGA8cfxx5oOQzVMHPDq",
      "updated_at": "2025-01-19T17:15:39.003Z",
      "created_at": "2025-01-19T17:15:39.003Z"
    },
    "tokens": {
      "access_token": "eyJhbG...tcM",
      "refresh_token": "eyJhbG...fWk"
    }
  },
  "success": true
}
```

To connect to the websocket, you need to provide the access token when initializing the websocket connection. Here is an example of how to connect to the websocket using Socket.io:

```javascript
io("ws://localhost:4000", {
  auth: {
    authorization: `Bearer {{ACCESS_TOKEN}}`,
  },
});
```

Once the websocket connection is established, a welcome message is emitted along with the number of posts within the last 5 minutes. To listen to this event:

```javascript
socket.on("connected", (payload) => {
	console.log("::> Socket connected", payload);
});
```

To listen for top 3 most recent stories:

```javascript
socket.on("top_3_latest_stories", (payload) => {
  console.log("::> Top 3 latest stories", payload);
});
```

# Frontend

Frontend application that implements the backend API to display the latest posts on Hacker News and alert users in real-time when a new post is added.

![Hacker News Scraper](./assets/image.png)

## Technologies Used

- Next.js
- Tailwind CSS
- Shad cn
- TanStack Query / Axios
- Socket.io

## Running the Frontend

```bash
# Install dependencies
yarn install

# Start the development server
yarn dev
```

The frontend server will be running on `http://localhost:3000`.