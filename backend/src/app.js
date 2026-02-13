import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";
import cors from "cors";
import userRoutes from "./routes/users.routes.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 🔥 Fix for ES Module __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Explicitly load .env from backend root
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

// ✅ Correct Port Setup
const PORT = process.env.PORT || 8000;

app.use(cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true
}));

app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

const start = async () => {
    try {

        // console.log("ENV CHECK:", process.env.MONGO_URI); // 🔍 Debug line (remove later)

        const connectionDb = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MONGO Connected DB Host: ${connectionDb.connection.host}`);

        server.listen(PORT, () => {
            console.log(`SERVER RUNNING ON PORT ${PORT}`);
        });

    } catch (error) {
        console.error("Database Connection Failed:", error);
        process.exit(1);
    }
};

start();
