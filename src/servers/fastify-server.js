import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import registerAuthRoutes from "./fastify-server/routes/auth.js";
import registerNewsRoutes from "./fastify-server/routes/news.js";

async function createFastifyServer(api, { app: { host }, api: { cookieSecret } }) {
  const fastify = Fastify({ logger: true });

  await fastify.register(fastifyCors, {
    origin: host,
    methods: ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
    credentials: true,
  });

  await fastify.register(fastifyCookie, { secret: cookieSecret });

  await fastify.register(fastifyMultipart, { attachFieldsToBody: "keyValues" });

  await fastify.register(fastifySwagger);

  await fastify.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
  });

  fastify.register(registerAuthRoutes, { api });
  fastify.register(registerNewsRoutes, { api });

  return fastify;
}

export default createFastifyServer;
