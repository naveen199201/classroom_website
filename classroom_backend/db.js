const { Pool } = require('pg');

const pool = new Pool({
  user: 'zgyaamyt',
  host: 'raja.db.elephantsql.com',
  database: 'zgyaamyt',
  password: 'ePEwy2lOSxEM7Uk-ZfC6vWRFNqSQet8L',
  port: 5432,
});

module.exports = { pool };
