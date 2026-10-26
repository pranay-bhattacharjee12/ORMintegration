"use server"

import { prisma } from "@/lib/db";

export async function createUser(formData: FormData){

    const email = formData.get("email") as String;
    const name = formData.get("name") as String;
    if(!email || !name ) return;

    const data = await prisma.user.create({
        data: {
            email: email,
            name: name,
            createdAt: new Date(),
        },
    });
    return data;
}


export async function getAllUsers(){
    const users = await prisma.user.findMany();

    return users;
}