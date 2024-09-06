-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" VARCHAR(20) NOT NULL,
    "email" VARCHAR(225) NOT NULL,
    "password" VARCHAR(225) NOT NULL,
    "profilePic" VARCHAR(225),
    "otp" VARCHAR(10),
    "socket_id" VARCHAR(225),
    "user_agent" VARCHAR(225),
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" VARCHAR(225),
    "message" TEXT,
    "status" VARCHAR(225),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "pic" VARCHAR(225) NOT NULL,
    "title" VARCHAR(225) NOT NULL,
    "description" VARCHAR(225) NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
