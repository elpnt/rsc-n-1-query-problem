import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { posts, users } from "@/db/schema";

export const getPosts = async () => {
  return db.query.posts.findMany();
};

export const getUsers = async () => {
  return db.query.users.findMany({
    with: {
      posts: true,
    },
  });
};

export const getUserById = async (id: number) => {
  return db.query.users.findFirst({
    where: eq(users.id, id),
  });
};

export const getPostsByUserId = async (userId: number) => {
  return db.query.posts.findMany({
    where: eq(posts.authorId, userId),
  });
};
