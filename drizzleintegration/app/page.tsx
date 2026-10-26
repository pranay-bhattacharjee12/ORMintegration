import Image from "next/image";

export default function Home() {
  return (
    <div> hi we are here learn drizzle integration </div>
  );
}


/* 

1.install drizzle-orm and its dependencies:
npm i drizzle-orm@rc @neondatabase/serverless dotenv
npm i -D drizzle-kit@rc tsx

2.setup neon db
Create a .env and add the following line:
DATABASE_URL=""

3.Connect Drizzle ORM to the database
Create a index.ts file in the src directory and add the following code:

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });



4.create the db schema 
Create a schema.ts file in the src/db directory and declare your table:

import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

5. Setup Drizzle config file
create a drizzle.config.ts file in the root of your project

import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});

6. Run the migration
npx drizzle-kit generate:migration create_users_table
npx drizzle-kit migrate

7. Create the actions for the user table
Create a user.action.ts file in the src/actions directory and add the following code:

"use server"
import { db, schema } from "@/lib/db/index";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm/sql/expressions/index";

code here

*/