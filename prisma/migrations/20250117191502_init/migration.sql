-- CreateTable
CREATE TABLE "stories" (
    "id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "url" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,
    "author" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stories_pkey" PRIMARY KEY ("id")
);
