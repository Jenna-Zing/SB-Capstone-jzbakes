import { Pool } from 'pg'; // pg: PostgreSQL client for Node.js — lets you run SQL queries from your code

// dotenv + pool are both essential for clean, secure configuration and DB access.
/* 
  - Pool is used to manage multiple DB connections.
  - You're creating a connection pool and exporting it to use elsewhere in your app.
  - dotenv.config() must come before any process.env references (done in app.ts).
 */

console.log('Connecting with config:', {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? '***' : undefined,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME,
});

pool
  .connect()
  .then((client) => {
    console.log('DB connection successful');
    client.release();
  })
  .catch((err) => {
    console.error('DB connection failed', err);
  });

export default pool;
