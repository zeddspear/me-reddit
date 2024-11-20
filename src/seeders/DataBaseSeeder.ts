import { MikroORM } from "@mikro-orm/core";
import { seedUsers } from "./UserSeeder";
import { seedPosts } from "./PostSeeder";

export const seedDatabase = async (orm: MikroORM) => {
  const em = orm.em.fork(); // Create a new EntityManager

  // Seed in desired order
  await seedUsers(em);
  await seedPosts(em);

  console.log("Database seeding completed.");
};
