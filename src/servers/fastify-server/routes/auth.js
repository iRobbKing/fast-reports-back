import Client from "../../client.js";

const COOKIE_PATH = "/auth";

async function registerRoutes(fastify, { api }) {
  fastify.route({
    url: "/auth/signIn",
    method: "POST",
    schema: {
      body: {
        type: "object",
        properties: {
          login: { type: "string" },
          password: { type: "string" },
        },
        required: ["login", "password"],
      },
    },
    async handler(request, reply) {
      const client = new Client(reply, request.cookies, COOKIE_PATH);
      await api.auth.signIn(request.body, { client });
    },
  });

  fastify.route({
    url: "/auth/signOut",
    method: "POST",
    async handler(request, reply) {
      const client = new Client(reply, request.cookies, COOKIE_PATH);
      await api.auth.signOut(null, { client });
    },
  });

  fastify.route({
    url: "/auth",
    method: "GET",
    schema: {
      response: {
        200: {
          type: "object",
          properties: {
            authenticated: { type: "boolean" },
          },
          required: ["authenticated"],
        },
      },
    },
    async handler(request, reply) {
      const client = new Client(reply, request.cookies, COOKIE_PATH);
      return await api.auth.isAuthenticated(null, { client });
    },
  });
}

export default registerRoutes;
