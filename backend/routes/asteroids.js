const { isValidDateString, fetchAsteroidsForDate } = require("./nasa");

// in-memory cache to reduce NASA calls and avoid rate limiting.
const cache = new Map(); // date - { data, expiresAt }
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 mins

// Dashboard endpoint:
//  validates date input
//  serves cached results to reduce NASA calls / rate limiting
//  normalizes NASA's feed response into a UI-friendly shape
const asteroidsRoute = (fastify, _opts, done) => {
  fastify.get(
    "/api/asteroids",
    {
      schema: {
        operationId: "getAsteroidsByDate",
        description: "Get asteroids close to Earth for a given date.",
        summary: "List near-earth asteroids for a date.",
        tags: ["asteroids"],
        querystring: {
          type: "object",
          required: ["date"],
          properties: {
            date: {
              type: "string",
              description: "Date to query in YYYY-MM-DD format (e.g. 2024-01-01).",
              example: "2024-01-01",
              pattern: "^\\d{4}-\\d{2}-\\d{2}$",
            },
          },
        },
        response: {
          200: {
            description: "Asteroids for the requested date - normalized for UI consumption.",
            type: "object",
            properties: {
              date: { type: "string", example: "2024-01-01" },
              count: { type: "number", example: 10 },
              asteroids: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string", example: "3724393" },
                    name: { type: "string", example: "(2015 OD22)" },
                    size_miles_avg: { type: ["number", "null"], example: 0.1531 },
                    size_miles_min: { type: ["number", "null"], example: 0.0946 },
                    size_miles_max: { type: ["number", "null"], example: 0.2115 },
                    miss_distance_miles: { type: ["number", "null"], example: 40648475.1 },
                    speed_mph: { type: ["number", "null"], example: 56801.97 },
                  },
                },
              },
            },
          },
          400: { 
            description: "Bad Request. Missing/invalid date format.",
            type: "object", 
            properties: { error: { type: "string" } },
            example: { error: "date is required in YYYY-MM-DD format" }
          },
          403: { 
            description: "Forbidden.",
            type: "object",
            properties: { error: { type: "string" } },
            example: { error: "NASA rejected the API key (403). Verify NASA_API_KEY in backend/.env." } 
          },
          429: { 
            description: "Too Many Requests.",
            type: "object",
            properties: { error: { type: "string" } },
            example: { error: "NASA rate limit hit. Try again shortly or use a personal API key." },
          },
          500: {
            description: "Server error.",
            type: "object",
            properties: { error: { type: "string" } },
            example: { error: "Server error" },
          }
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