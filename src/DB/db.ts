import { Pool } from 'pg'
import dotenv from 'dotenv'
import asynchandler from '@app/middlewares/asynchandler/asynchandler';

dotenv.config()
const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

});

//simply test the connection.
export const testDBConection = asynchandler(async () => {
    try {
        const client = await pool.connect();
        console.log("Database connected successfully!");
        client.release(); // release the connection back to the pool
        return { success: true, message: "Database connected successfully!" };

    } catch (error: any) {
        console.error("Database connection failed:", error.message);
        return { success: false, message: "Database connection failed", error: error.message };

    }

})


export default pool 