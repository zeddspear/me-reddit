export const __prod__ = process.env.NODE_ENV === "production" ? true : false;
export const __dbpassword__ = process.env.DB_PASSWORD;
export const __port__ = process.env.PORT || 4000;
export const __sessionsecret__ = process.env.SESSION_SECRET;
export const __cookiename__ = "qid";
