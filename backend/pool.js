import pg from "pg";
function connectDatabase() {
  const pool = new pg.Pool({
    user: "postgres",
    password: "deebee",
    database: "projectpos",
    host: "localhost",
    port: 5433,
  });
  return pool;
}
export { connectDatabase };
