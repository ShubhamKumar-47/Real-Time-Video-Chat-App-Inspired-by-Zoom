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

// ✅ Explicitly load .env from backend root and override any existing vars
// dotenv v17 supports the `override` option so local .env values win during development
dotenv.config({ path: path.join(__dirname, "../.env"), override: true });

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

// ✅ Correct Port Setup
const PORT = process.env.PORT || 8000;

const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175"
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
            return callback(null, true);
        }
        if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

const start = async () => {
    try {

        // show which MONGO_URI is being used (helpful when multiple env sources exist)
        console.log('Using MONGO_URI:', process.env.MONGO_URI?.startsWith('mongodb') ? (process.env.MONGO_URI.includes('@') ? process.env.MONGO_URI.split('@').pop() : process.env.MONGO_URI) : process.env.MONGO_URI);

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
