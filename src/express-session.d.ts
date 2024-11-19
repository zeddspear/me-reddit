import session from "express-session";

declare module "express-session" {
  interface Session {
    userID?: number | string; // or the appropriate type for userID
  }
}
