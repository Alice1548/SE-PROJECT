const sql = require('mssql');

const config = {
    user: 'sa',
    password: '',//Your Password
    server: '',//Your Server
    database: 'SE',//Your Database
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

async function checkConnection() {
    try {
        console.log("Connecting to database...");
        const pool = await sql.connect(config);
        console.log("Connection Successful!");
        return pool;
    } catch (err) {
        console.error("Connection Failed:", err);
        throw new Error("Database connection failed");
    }
}


module.exports = checkConnection;