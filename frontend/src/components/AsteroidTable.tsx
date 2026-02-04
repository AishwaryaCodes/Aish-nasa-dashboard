import { useState } from "react";

type Asteroid = {
  id: string;
  name: string;
  size_miles_avg: number | null;
  size_miles_min: number | null;
  size_miles_max: number | null;
  miss_distance_miles: number | null;
  speed_mph: number | null;
};

type SortKey = "size" | "distance" | "speed";
type SortOrder = "asc" | "desc";

const formatNumber = (n: number | null, decimals = 2): string => {
  if (n === null || Number.isNaN(n)) return "—";

  return n.toLocaleString(undefined, {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
};


export default function AsteroidTable({
  asteroids,
}: {
  asteroids: Asteroid[];
}) {
  const [sortKey, setSortKey] = useState<SortKey>("distance");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  }

  const sortedAsteroids = [...asteroids].sort((a, b) => {
    const getValue = (x: Asteroid) => {
      if (sortKey === "size") return x.size_miles_avg ?? 0;
      if (sortKey === "distance") return x.miss_distance_miles ?? 0;
      return x.speed_mph ?? 0;
    };

    const diff = getValue(a) - getValue(b);
    return sortOrder === "asc" ? diff : -diff;
  });

  const sortArrow = sortOrder === "asc" ? " ↑ " : " ↓ ";  // sorting icon in UI

  return (
    <table
      style={{
        width: "65%",
        borderCollapse: "collapse",
        marginTop: 12,
      }}
    >
      <thead>
        <tr>
          <th style={thStyle}>Name</th>

          <th
            style={{ ...thStyle, cursor: "pointer" }}
            onClick={() => handleSort("size")}
          >
            Size (avg)
            {sortKey === "size" ? sortArrow : ""}
          </th>

          <th
            style={{ ...thStyle, cursor: "pointer" }}
            onClick={() => handleSort("distance")}
          >
            Closeness to Earth (mi)
            {sortKey === "distance" ? sortArrow : ""}
          </th>

          <th
            style={{ ...thStyle, cursor: "pointer" }}
            onClick={() => handleSort("speed")}
          >
            Relative Velocity (mph)
            {sortKey === "speed" ? sortArrow : ""}
          </th>
        </tr>
      </thead>

      <tbody>
        {sortedAsteroids.map((a) => (
          <tr key={a.id}>
            <td style={tdStyle}>{a.name}</td>
            <td style={tdStyle}>{formatNumber(a.size_miles_avg, 4)}</td>
            <td style={tdStyle}>{formatNumber(a.miss_distance_miles, 0)}</td>
            <td style={tdStyle}>{formatNumber(a.speed_mph, 0)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  border: "1px solid #9D9494",
  padding: "5px",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #B9B3B3",
  padding: "5px",
};
