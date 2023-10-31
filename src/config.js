export default {
  db: {
    host: "127.0.0.1",
    port: 5432,
    database: "news",
    user: "super",
    password: "super",
  },
  pg: {
    database: "postgres",
    user: "postgres",
    password: "postgres",
  },
  api: {
    port: 8080,
    server: "fastify",
    cookieSecret: "secret",
  },
  sandbox: {
    timeout: 5000,
    displayErrors: false,
  },
  app: {
    host: "http://localhost:5173",
  },
};
