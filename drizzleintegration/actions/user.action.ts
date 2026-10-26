"use server"
import { db, schema } from "@/lib/db/index";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm/sql/expressions/index";

interface UserData {
    name: string;
    age: number;
    email: string;
}

export const createUser = async (userData: UserData) => {
    await db.insert(users).values(userData);
};

export const getAllUsers = async () => {
    return await db.select().from(users);
};

export const getUserById = async (id: number) => {
    return await db.select().from(users).where(eq(users.id, id));
};

export const updateUser = async (id: number, userData: Partial<UserData>) => {
    await db.update(users).set({...userData, updated_at: new Date()}).where(eq(users.id, id));
};

export const deleteUser = async (id: number) => {
    await db.delete(users).where(eq(users.id, id));
}
