// src/seeders/CreatePostsSeeder.ts
import { EntityManager } from "@mikro-orm/core";
import { Post } from "../entity/post/post.entity";
import { User } from "../entity/user/user.entity";

export const seedPosts = async (em: EntityManager) => {
  // Fetch all users, assuming you have at least 10 in the database.
  const users = await em.find(User, {});
  if (users.length < 10) {
    throw new Error(
      "Please ensure there are at least 10 users in the database."
    );
  }

  // Generate 100 posts
  for (let i = 1; i <= 100; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];

    // Create new Post instance
    const post = em.create(Post, {
      title: `Magic Hunter Post ${i}`,
      text: `Unique content for post ${i}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      creator: randomUser, // Associate post with a random user,
      points: 0,
    });

    em.persist(post); // Mark for insertion
  }

  await em.flush(); // Save all posts to the database
};
