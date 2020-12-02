const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: "5748",
    database: "geoLocation",
    host: "localhost",
    port: "5432"
});

module.exports = pool;

