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


# Demo

![Hacker News Scraper](./assets/image.png)

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

# Frontend

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