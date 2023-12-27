## Solve N+1 problem in React Server Components

What's this?

- [React Server Components と GraphQL のアナロジー](https://quramy.medium.com/react-server-components-%E3%81%A8-graphql-%E3%81%AE%E3%82%A2%E3%83%8A%E3%83%AD%E3%82%B8%E3%83%BC-89b3f5f41a01)
- https://gist.github.com/Quramy/7b9036f236b2ac2fdac0a2d0f4f49172

### Setup

```bash
# Install dependencies
bun i

# Database setup
docker-compose up -d
bun db:push
bun db:seed

# Start dev server
bun dev

# Shut down database when you finish the demo
docker-compose down
```

### Check queries executed by Drizzle ORM

Fetch 10 posts and their authors.

```jsx
export default function Page() {
  // 10 seeded posts
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

const User = ({ userId }) => {
  const user = await getUserById(userId); // 🚨 Should be optimized to avoid N+1

  return (
    <div>
      <p>{user.name}</p>
      <p>{user.email}</p>
    </div>
  )
}
```

#### Unoptimized

1 (get posts) + 10 (get author for each post) queries are executed.

```
Query: select "id", "title", "content", "author_id" from "posts"
Query: select "id", "name", "email" from "users" where "users"."id" = $1 limit $2 -- params: [2, 1]
Query: select "id", "name", "email" from "users" where "users"."id" = $1 limit $2 -- params: [2, 1]
Query: select "id", "name", "email" from "users" where "users"."id" = $1 limit $2 -- params: [1, 1]
Query: select "id", "name", "email" from "users" where "users"."id" = $1 limit $2 -- params: [2, 1]
Query: select "id", "name", "email" from "users" where "users"."id" = $1 limit $2 -- params: [2, 1]
Query: select "id", "name", "email" from "users" where "users"."id" = $1 limit $2 -- params: [3, 1]
Query: select "id", "name", "email" from "users" where "users"."id" = $1 limit $2 -- params: [1, 1]
Query: select "id", "name", "email" from "users" where "users"."id" = $1 limit $2 -- params: [1, 1]
Query: select "id", "name", "email" from "users" where "users"."id" = $1 limit $2 -- params: [3, 1]
Query: select "id", "name", "email" from "users" where "users"."id" = $1 limit $2 -- params: [2, 1]
```

#### Optimized

Only 2 queries are executed.

```
Query: select "id", "title", "content", "author_id" from "posts"
Query: select "users"."id", "users"."name", "users"."email", "users_posts"."data" as "posts" from "users" left join lateral (select coalesce(json_agg(json_build_array("users_posts"."id", "users_posts"."title", "users_posts"."content", "users_posts"."author_id")), '[]'::json) as "data" from "posts" "users_posts" where "users_posts"."author_id" = "users"."id") "users_posts" on true
```
