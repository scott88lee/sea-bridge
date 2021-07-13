const pg = require('pg');

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME, //soundalchemymusic inventory management accounting
  port: process.env.DB_PORT
};

const dev = {
  user: 'test',
  password: 'test',
  host: 'test.test.com',
  database: 'test',
  port: 5432
};

const pool = new pg.Pool( (process.env.NODE_ENV=='dev') ? dev : dbConfig);

pool.on('error', function (err) {
  console.log('idle client error', err.message, err.stack);
});

module.exports = pool;