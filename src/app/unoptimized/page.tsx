import { getPosts, getUserById } from "@/services";

const User = async ({ userId }: { userId: number }) => {
  const user = await getUserById(userId);

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
