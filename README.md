# Backend

## Setting Up Prisma
Ensure you have the `DATABASE_URL` environment variable set in a `.env` file in the root of the project, which is the connection string to your database.

```.env
# If you are using the database in a docker container, you can use the following connection string

DATABASE_URL="postgresql://postgres:password@localhost:5420/hacker-news-scraper"
```


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