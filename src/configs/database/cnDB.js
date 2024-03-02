// Get the client
import mysql from 'mysql2/promise';
require('dotenv').config();

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
    host: process.env.HOSTNAME,
    user: process.env.USERNAME,
    database: process.env.DBNAME,
    password: process.env.PASSWORD,
});
export default pool;