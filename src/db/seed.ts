import { faker } from "@faker-js/faker";

import { db } from "./client";
import { users, posts } from "./schema";

function generatePosts() {
  const posts = [];
  for (let i = 0; i < 10; i++) {
    posts.push({
      id: i + 1,
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(3),
      authorId: faker.number.int({ min: 1, max: 3 }),
    });
  }
  return posts;
}

async function main() {
  await db.delete(users);

  await db.insert(users).values([
    { id: 1, name: "Alice", email: faker.internet.email() },
    { id: 2, name: "Bob", email: faker.internet.email() },
    { id: 3, name: "Charlie", email: faker.internet.email() },
  ]);
  await db.insert(posts).values(generatePosts());
}

main()
  .then(() => {
    console.log("Seeding done!");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
