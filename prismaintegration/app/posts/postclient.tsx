
"use client";

import { useState } from "react";
import {
  createPost,
  getAllPost,
  getPostByID,
  deletePostByID,
  updatePostByID,
} from "@/action/post-actions";

type Post = {
  id: number;
  title: string;
  content: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export default function PostsClient({
  initialPosts,
}: {
  initialPosts: Post[];
}) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const runAction = async (action: () => Promise<void>) => {
    setLoading(true);
    setMessage("");

    try {
      await action();
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const refreshPosts = async () => {
    const data = await getAllPost();
    setPosts(data as Post[]);
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await runAction(async () => {
      const formData = new FormData();
      formData.set("title", title);
      formData.set("content", content);

      const post = await createPost(formData);

      if (!post) throw new Error("Title is required.");

      setMessage(`CREATE successful! Post ID: ${post.id}`);
      setTitle("");
      setContent("");
      await refreshPosts();
    });
  };

  const handleGetAll = async () => {
    await runAction(async () => {
      await refreshPosts();
      setMessage("GET ALL successful!");
    });
  };

  const handleGetById = async () => {
    if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
      setMessage("Enter a valid post ID.");
      return;
    }

    await runAction(async () => {
      const post = await getPostByID(Number(id));

      if (!post) {
        setMessage("Post not found.");
        return;
      }

      setTitle(post.title);
      setContent(post.content ?? "");
      setEditingId(post.id);
      setMessage(`GET BY ID successful! Post ID: ${post.id}`);
    });
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editingId === null) {
      setMessage("First fetch a post by ID to update it.");
      return;
    }

    await runAction(async () => {
      const formData = new FormData();
      formData.set("title", title);
      formData.set("content", content);

      const post = await updatePostByID(editingId, formData);

      if (!post) throw new Error("Title is required.");

      setMessage(`UPDATE successful! Post ID: ${post.id}`);
      await refreshPosts();
    });
  };

  const handleDelete = async (postId: number) => {
    if (!window.confirm(`Delete post ${postId}?`)) return;

    await runAction(async () => {
      await deltePostByID(postId);

      setPosts((current) => current.filter((post) => post.id !== postId));

      if (editingId === postId) {
        setEditingId(null);
        setTitle("");
        setContent("");
      }

      setMessage(`DELETE successful! Post ID: ${postId}`);
    });
  };

  const startEditing = (post: Post) => {
    setId(String(post.id));
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content ?? "");
    setMessage(`Post ${post.id} loaded into the form.`);
  };

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100">
      <div className="mx-auto max-w-5xl space-y-8">
        <header>
          <h1 className="text-3xl font-bold">Prisma CRUD Tester</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Test your Next.js Server Actions: Create, Read, Update and Delete.
          </p>
        </header>

        {message && (
          <div
            role="status"
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm"
          >
            {message}
          </div>
        )}

        {loading && (
          <p className="text-sm text-amber-400">Running action...</p>
        )}

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">1. Create Post</h2>

          <form onSubmit={handleCreate} className="space-y-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 outline-none focus:border-blue-500"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Post content"
              rows={4}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 outline-none focus:border-blue-500"
            />

            <button
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2 font-medium hover:bg-blue-500 disabled:opacity-50"
            >
              Create Post
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">2. Read Posts</h2>

          <button
            onClick={handleGetAll}
            disabled={loading}
            className="rounded-lg bg-emerald-600 px-5 py-2 hover:bg-emerald-500 disabled:opacity-50"
          >
            Get All Posts
          </button>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              type="number"
              min="1"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Enter post ID"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 sm:max-w-xs"
            />

            <button
              onClick={handleGetById}
              disabled={loading}
              className="rounded-lg bg-violet-600 px-5 py-2 hover:bg-violet-500 disabled:opacity-50"
            >
              Get Post By ID
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">3. Update Post</h2>

          <p className="mb-4 text-sm text-zinc-400">
            Fetch a post by ID, or click Edit on a post below. Then modify its
            title or content and submit.
          </p>

          <form onSubmit={handleUpdate} className="space-y-4">
            <p className="text-sm text-amber-400">
              {editingId !== null
                ? `Editing post ID: ${editingId}`
                : "No post selected"}
            </p>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Updated title"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Updated content"
              rows={4}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3"
            />

            <button
              type="submit"
              disabled={loading || editingId === null}
              className="rounded-lg bg-amber-600 px-5 py-2 hover:bg-amber-500 disabled:opacity-50"
            >
              Update Post
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setTitle("");
                  setContent("");
                  setMessage("Editing cancelled.");
                }}
                className="ml-3 rounded-lg border border-zinc-700 px-5 py-2"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">
              All Posts ({posts.length})
            </h2>
            <button
              onClick={handleGetAll}
              disabled={loading}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800"
            >
              Refresh
            </button>
          </div>

          {posts.length === 0 ? (
            <p className="rounded-xl border border-zinc-800 p-6 text-zinc-400">
              No posts found. Create your first post above.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
                >
                  <p className="mb-2 text-xs text-zinc-500">
                    Post ID: {post.id}
                  </p>

                  <h3 className="break-words text-lg font-semibold">
                    {post.title}
                  </h3>

                  <p className="mt-2 whitespace-pre-wrap break-words text-sm text-zinc-400">
                    {post.content || "No content"}
                  </p>

                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => startEditing(post)}
                      className="rounded-lg bg-amber-600 px-3 py-2 text-sm hover:bg-amber-500"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={loading}
                      className="rounded-lg bg-red-600 px-3 py-2 text-sm hover:bg-red-500 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
