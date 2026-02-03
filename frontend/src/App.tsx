import { useState } from "react";
import AsteroidTable from "./components/AsteroidTable";

type Asteroid = {
  id: string;
  name: string;
  size_miles_avg: number | null;
  size_miles_min: number | null;
  size_miles_max: number | null;
  miss_distance_miles: number | null;
  speed_mph: number | null;
};

type ApiResponse = {
  date: string;
  count: number;
  asteroids: Asteroid[];
};

export default function App() {
  const [date, setDate] = useState("2025-01-01"); // Default date
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const today = new Date().toISOString().split("T")[0];

  async function loadAsteroids() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `http://localhost:3001/api/asteroids?date=${date}`
      );

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const json: ApiResponse = await res.json();
      setData(json);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ paddingLeft: 24 }}>
      <h2>NASA Dashboard</h2>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <label>
          Select Date:{" "}
          <input
            type="date"
            value={date}
            max={today}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <button onClick={loadAsteroids} disabled={loading}>
          {loading ? "Loading....." : "Get Asteroids"}
        </button>
      </div>

      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}

      {data && (
        <div style={{ marginTop: 16 }}>
          <p>
            Date: <b>{data.date}</b> | Total Count: <b>{data.count}</b> 
          </p>

          {data.asteroids.length === 0 ? (
            <p>No asteroids found for this date.</p> // If there are no asteroids.
          ) : (
            <AsteroidTable asteroids={data.asteroids} />
          )}
        </div>
      )}
    </div>
  );
}
