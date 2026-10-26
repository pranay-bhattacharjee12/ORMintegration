import { createUser } from "@/action/action";
import { getAllPost } from "@/action/post-actions";
import PostsClient from "./posts/postclient";


export default async function Home() {

  const posts = await getAllPost();

  return (
    <>
    <PostsClient initialPosts={posts} />;
      
       <main className="min-h-screen bg-zinc-950 p-8 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold">
          My Posts
        </h1>

        {posts.length === 0 ? (
          <p className="text-zinc-400">
            No posts found. Create your first post!
          </p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
              >
                <h2 className="text-xl font-semibold">
                  {post.title}
                </h2>

                <p className="mt-2 whitespace-pre-wrap text-zinc-400">
                  {post.content || "No content available"}
                </p>

                <p className="mt-3 text-xs text-zinc-500">
                  Last updated:{" "}
                  {new Date(post.updatedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>

      <div>
        <h1>create user </h1>

        <form action={createUser}>

          <input
            type="text"
            name="name"
            placeholder="enter your name "
            required
          />

          <input
            type="text"
            name="email"
            placeholder="enter your email "
            required
          />

          <button type="submit">submit </button>

        </form>
      </div>
    </>
  );
}
