import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { Migrator } from "@mikro-orm/migrations";
import { PostgreSqlDriver, Options } from "@mikro-orm/postgresql";
import { __dbpassword__, __prod__ } from "./constants";

const config: Options = {
  driver: PostgreSqlDriver,
  dbName: "mereddit",
  user: "postgres",
  password: __dbpassword__,
  host: "localhost",
  port: 5432,

  // folder-based discovery setup, using common filename suffix
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
  // we will use the ts-morph reflection, an alternative to the default reflect-metadata provider
  // check the documentation for their differences: https://mikro-orm.io/docs/metadata-providers
  metadataProvider: TsMorphMetadataProvider,
  // enable debug mode to log SQL queries and discovery information
  debug: !__prod__,

  extensions: [Migrator],
};

export default config;
