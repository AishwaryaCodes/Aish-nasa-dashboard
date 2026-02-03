const isValidDateString = (date) => {
  // date type: YYYY-MM-DD
  return typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date);
};

const buildNasaUrl = (date, apiKey) => {
  return `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${apiKey}`;
};

const simplifyNeo = (neo) => {
  const approach = neo.close_approach_data?.[0];

  const minMiles = neo.estimated_diameter?.miles?.estimated_diameter_min ?? null;
  const maxMiles = neo.estimated_diameter?.miles?.estimated_diameter_max ?? null;

  const avgMiles =
    typeof minMiles === "number" && typeof maxMiles === "number"
      ? (minMiles + maxMiles) / 2
      : null;

  const missMiles = approach?.miss_distance?.miles
    ? Number(approach.miss_distance.miles)
    : null;

  const speedMph = approach?.relative_velocity?.miles_per_hour
    ? Number(approach.relative_velocity.miles_per_hour)
    : null;

  return {
    id: neo.id,
    name: neo.name,
    size_miles_avg: avgMiles,
    size_miles_min: minMiles,
    size_miles_max: maxMiles,
    miss_distance_miles: missMiles,
    speed_mph: speedMph,
  };
};

const fetchAsteroidsForDate = async ({ date, apiKey }) => {
  const url = buildNasaUrl(date, apiKey);
  const res = await fetch(url);

  if (!res.ok) {
    const message =
      res.status === 429
        ? "NASA rate limit hit. Try again shortly or use a personal API key."
        : res.status === 403
          ? "NASA rejected the API key (403). Verify NASA_API_KEY in backend/.env."
          : "NASA API request failed.";

    const error = new Error(message);
    error.statusCode = res.status;
    throw error;
  }

  const data = await res.json();
  const list = data.near_earth_objects?.[date] || [];
  return list.map(simplifyNeo);
};

module.exports = {
  isValidDateString,
  fetchAsteroidsForDate,
};
