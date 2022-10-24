import pg from "pg";

function connectDatabase() {
  const pool = new pg.Pool({
    user: "postgres",
    database: "projectpos",
    password: "deebee",
    host: "localhost",
    port: "5433",
  });
  return pool;
}

export { connectDatabase };
