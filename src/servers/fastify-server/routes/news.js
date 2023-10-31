async function registerRoutes(fastify, { api }) {
  fastify.route({
    url: "/news",
    method: "GET",
    schema: {
      querystring: {
        type: "object",
        properties: {
          filter: { type: "string" },
          start: { type: "number" },
          count: { type: "number" },
        },
      },
      response: {
        200: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              title: { type: "string" },
              content: { type: "string" },
              publish_date: { type: "string" },
              image: { type: "string" },
            },
            required: ["id", "title", "content", "publish_date"],
          },
        },
      },
    },
    async handler(request) {
      const { filter, start, count } = request.query;
      return await api.news.getList({ filter, start, count });
    },
  });

  fastify.route({
    url: "/news/:id",
    method: "GET",
    schema: {
      params: {
        type: "object",
        properties: {
          id: { type: "number" },
        },
        required: ["id"],
      },
      response: {
        200: {
          type: "object",
          properties: {
            id: { type: "number" },
            title: { type: "string" },
            content: { type: "string" },
            publish_date: { type: "string" },
            image: { type: "string" },
          },
          required: ["id", "title", "content", "publish_date"],
        },
      },
    },
    async handler(request) {
      return await api.news.getById(request.params.id);
    },
  });

  fastify.route({
    url: "/news/count",
    method: "GET",
    schema: {
      response: {
        200: { type: "number" },
      },
    },
    async handler() {
      return await api.news.getCount();
    },
  });

  fastify.route({
    url: "/news",
    method: "POST",
    schema: {
      consumes: ["multipart/form-data"],
      body: {
        type: "object",
        properties: {
          title: { type: "string" },
          content: { type: "string" },
          publish_date: { type: "string" },
          image: { type: "object" },
        },
        required: ["title", "content", "publish_date", "image"],
      },
    },
    async handler(request) {
      await api.news.create(request.body);
    },
  });

  fastify.route({
    url: "/news/:id",
    method: "PUT",
    schema: {
      consumes: ["multipart/form-data"],
      params: {
        type: "object",
        properties: {
          id: { type: "number" },
        },
        required: ["id"],
      },
      body: {
        type: "object",
        properties: {
          title: { type: "string" },
          content: { type: "string" },
          publish_date: { type: "string" },
          image: { type: "object" },
        },
        required: ["title", "content", "publish_date"],
      },
    },
    async handler(request) {
      await api.news.update({ id: request.params.id, ...request.body });
    },
  });

  fastify.route({
    url: "/news/:id",
    method: "DELETE",
    schema: {
      params: {
        type: "object",
        properties: {
          id: { type: "number" },
        },
        required: ["id"],
      },
    },
    async handler(request) {
      await api.news.delete(request.params.id);
    },
  });
}

export default registerRoutes;
