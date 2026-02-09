import pkg from "pg";
const { Client } = pkg;

// CREATE DATABASE
const database = new Client({
    // user: process.env.DB_USER,
    user: "postgres",
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    // password: process.env.DB_PASSWORD,
    password: "root",
    port: process.env.DB_PORT,
});

// ESTABLISHING CONNECTION WITH DATABASE
try {
    await database.connect();
    console.log("Database connected successfully");
} catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
}

export default database;