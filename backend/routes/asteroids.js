const { isValidDateString, fetchAsteroidsForDate } = require("./nasa");

// in-memory cache to reduce NASA calls and avoid rate limiting.
const cache = new Map(); // date - { data, expiresAt }
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 mins

const asteroidsRoute = (fastify, _opts, done) => {
  fastify.get(
    "/api/asteroids",
    {
      schema: {
        description: "Get asteroids close to Earth for a given date",
        tags: ["asteroids"],
        querystring: {
          type: "object",
          required: ["date"],
          properties: {
            date: {
              type: "string",
              description: "Date in YYYY-MM-DD format",
            },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              date: { type: "string" },
              count: { type: "number" },
              asteroids: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    size_miles_avg: { type: ["number", "null"] },
                    size_miles_min: { type: ["number", "null"] },
                    size_miles_max: { type: ["number", "null"] },
                    miss_distance_miles: { type: ["number", "null"] },
                    speed_mph: { type: ["number", "null"] },
                  },
                },
              },
            },
          },
          400: { type: "object", properties: { error: { type: "string" } } },
          403: { type: "object", properties: { error: { type: "string" } } },
          429: { type: "object", properties: { error: { type: "string" } } },
        },
      },
    },
    async (request, reply) => {
      const { date } = request.query;

      if (!isValidDateString(date)) {
        return reply
          .code(400)
          .send({ error: "date is required in YYYY-MM-DD format" });
      }

      const cached = cache.get(date);
      if (cached && cached.expiresAt > Date.now()) {
        fastify.log.debug({ date }, "Serving asteroids from cache");
        return cached.data;
      }

      try {
        fastify.log.debug({ date }, "Fetching asteroids from NASA API");

        const asteroids = await fetchAsteroidsForDate({
          date,
          apiKey: process.env.NASA_API_KEY || "DEMO_KEY",
        });

        const payload = {
          date,
          count: asteroids.length,
          asteroids,
        };

        cache.set(date, {
          data: payload,
          expiresAt: Date.now() + CACHE_TTL_MS,
        });

        return payload;
      } catch (err) {
        const status = err.statusCode || 500;
        return reply
          .code(status)
          .send({ error: err.message || "Server error" });
      }
    },
  );

  done();
};

module.exports = asteroidsRoute;