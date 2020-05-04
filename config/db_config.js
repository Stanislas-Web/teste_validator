const mysql = require("mysql");

const sql = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "jojo"
});


sql.connect();

module.exports = sql;