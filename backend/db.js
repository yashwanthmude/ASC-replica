const Pool = require('pg').Pool;
const pool = new Pool({
    user: "yash",
    password: "yash",
    host: "localhost",
    port: 5432,
    database: "biguniv"
});

module.exports = pool;