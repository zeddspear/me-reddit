// src/seeders/CreateUsersSeeder.ts
import { EntityManager } from "@mikro-orm/core";
import { User } from "../entity/user/user.entity";
import { faker } from "@faker-js/faker";

export const seedUsers = async (em: EntityManager) => {
  // Generate 10 users with realistic data
  const users = Array.from({ length: 10 }).map(() => ({
    username: faker.internet.username(),
    email: faker.internet.email(),
    password: faker.internet.password(), // generate secure password with length 12
  }));

  // Create and persist each user
  for (const userData of users) {
    const user = em.create(User, userData);
    em.persist(user);
  }

  // Save all users to the database
  await em.flush();
};
