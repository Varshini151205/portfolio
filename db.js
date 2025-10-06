// db.js — creates a MySQL pool using mysql2/promise
const mysql = require('mysql2/promise');
require('dotenv').config();


const pool = mysql.createPool({
host: process.env.DB_HOST || 'localhost',
user: process.env.DB_USER || 'root',
password: process.env.DB_PASSWORD || 'system',
database: process.env.DB_NAME || 'portfolio_db',
waitForConnections: true,
connectionLimit: 10,
queueLimit: 0
});


module.exports = pool;