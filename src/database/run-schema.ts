import pool from "./db";
import fs from "fs";
import path from "path";

async function runSchema() {
    try {
        const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
        await pool.query(schema);
        console.log("Schema executed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error executing schema:", error);
        process.exit(1);
    }
}

runSchema();
