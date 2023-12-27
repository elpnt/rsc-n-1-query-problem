import { getPosts, getUsers } from "@/services";
import DataLoader from "dataloader";
import { cache } from "react";

const getUserLoader = () =>
  new DataLoader((ids: readonly number[]) =>
    getUsers().then((users) =>
      ids.map((id) => users.find((user) => user.id === id))
    )
  );
const memoizedGetUserLoader = cache(getUserLoader);

const User = async ({ userId }: { userId: number }) => {
  const user = await memoizedGetUserLoader().load(userId);

  if (!user) return null;

  return (
    <div>
      <p>{user.name}</p>
      <p>{user.email}</p>
    </div>
  );
};

export default async function UserPage() {
  const posts = await getPosts();

  return (
    <ol>
      {posts.map((post) => (
        <li key={post.id}>
          <h3>{post.title}</h3>
          <User userId={post.authorId} />
        </li>
      ))}
    </ol>
  );
}
