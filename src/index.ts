import config from "./mikro-orm.config"; // Importing MikroORM configuration
import { initORM } from "./db"; // Importing ORM initialization function
import "dotenv/config"; // Importing and configuring dotenv for environment variables
import { __dbpassword__, __port__, __prod__ } from "./constants"; // Importing constants
import express from "express"; // Importing Express framework
import { ApolloServer } from "@apollo/server"; // Importing Apollo Server
import { buildSchema } from "type-graphql"; // Importing TypeGraphQL buildSchema function
import { HelloResolver } from "./resolvers/hello"; // Importing HelloResolver
import http from "http"; // Importing HTTP module
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"; // Importing Apollo Server plugin for draining HTTP server
import { expressMiddleware } from "@apollo/server/express4"; // Importing Apollo Server Express middleware
import cors from "cors"; // Importing CORS middleware
import { PostResolver } from "./resolvers/post"; // Importing PostResolver

async function main() {
  const db = await initORM(config); // Initialize ORM with configuration

  const app = express(); // Create an Express application

  const httpServer = http.createServer(app); // Create an HTTP server

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver], // Define resolvers for GraphQL schema
      validate: false, // Disable validation
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })], // Add plugin to drain HTTP server
  });

  await apolloServer.start(); // Start Apollo Server

  app.use(
    "/graphql", // Define GraphQL endpoint
    cors<cors.CorsRequest>(), // Enable CORS
    express.json(), // Parse JSON requests
    expressMiddleware(apolloServer, {
      context: async () => {
        return { em: db.em.fork() }; // Provide context with ORM entity manager
      },
    })
  );

  await new Promise<void>((resolve) => {
    try {
      httpServer.listen({ port: __port__ }, resolve); // Start HTTP server on specified port
      console.log("Server connected to port:", __port__); // Log successful connection
    } catch (error) {
      console.log("An error occured while connecting to server", error); // Log any errors
    }
  });
}

main(); // Execute main function
