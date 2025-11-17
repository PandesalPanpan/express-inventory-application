import { Pool } from "pg";
import dotenv from 'dotenv';
dotenv.config()

export default new Pool({
    connectionString: process.env.DB_CONNECTION_STRING
    // connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB}`,
    // host: process.env.DB_HOST,
    // user: process.env.DB_USER,
    // database: process.env.DB,
    // password: process.env.DB_PASS,
    // port: process.env.DB_PORT
})