const { Pool } = require("pg");

// Construct connection string using environment variables
const connectionString = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || connectionString,
});

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  // Attempt to safely release the client back to the pool
  if (client) {
    client.release();
  }
});

// Test the connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error executing query", err.stack);
  } else {
    console.log(
      "Successful connection to the database established at:",
      res.rows[0].now
    );
  }
});

module.exports = pool;
