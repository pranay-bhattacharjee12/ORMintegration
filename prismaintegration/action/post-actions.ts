"use server"
import { prisma } from "@/lib/db";


export const createPost = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    if (!title) return;

    const post = await prisma.post.create({
        data: {
            title,
            content
        }
    });
    return post;
};


//issue with getallpost and findMany
export const getAllPost = async () => {
    const posts = await prisma.post.findMany({
        orderBy: {
            updatedAt: "desc"
        }
    });
    return posts;
};

export const getPostByID = async (id: number) => {
    const post = await prisma.post.findUnique({
        where: {
            id: id
        }
    });
    return post;
};

export const deletePostByID = async (id: number) => {
    const post = await prisma.post.delete({
        where: {
            id: id
        }
    });
    return {
        message: "post deleted "
    };
};

export const updatePostByID = async (id: number, formData: FormData) => {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    if (!title) return;

    const post = await prisma.post.update({
        where: {
            id: id
        },
        data: {
            title,
            content
        }
    });
    return post;
};
