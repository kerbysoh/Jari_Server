const Pool = require("pg").Pool

const pool = new Pool({
    user: "kerbysoh",
    password: "ksck3041",
    host: "localhost",
    port: 5432,
    database: "proj"
})


module.exports = pool