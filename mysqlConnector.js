const mysql = require('mysql');
require('dotenv').config(); // Load environment variables from .env

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  };  

const pool = mysql.createPool(dbConfig);

// Helper function to execute SQL queries
function query(sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err);
      }
      connection.query(sql, values, (queryErr, results) => {
        connection.release();
        if (queryErr) {
          return reject(queryErr);
        }
        resolve(results);
      });
    });
  });
}

module.exports = {
  query,
};
