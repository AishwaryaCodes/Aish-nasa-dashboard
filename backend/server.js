require("dotenv").config();

const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");
const swagger = require("@fastify/swagger");
const swaggerUI = require("@fastify/swagger-ui");

const asteroidsRoute = require("./routes/asteroids");

fastify.register(cors, { origin: true });

fastify.register(swagger, {
  openapi: {
    openapi: "3.0.3",
    info: {
      title: "NASA Dashboard API",
      description: "Backend API for the NASA dashboard.",
      version: "1.0.0",
    },
  },
});

fastify.register(swaggerUI, {
  routePrefix: "/docs",
  uiConfig: { docExpansion: "list", deepLinking: false },
});

// Simple health check for local dev and deployment test
fastify.get("/health", async () => ({ ok: true }));

// Routes
fastify.register(asteroidsRoute);

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: "0.0.0.0" });
    fastify.log.info("Server running on http://localhost:3001");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
