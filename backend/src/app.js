import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";
import cors from "cors";
import userRoutes from "./routes/users.routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = createServer(app);

connectToSocket(server);

const PORT = process.env.PORT || 8000;

const allowedOrigins = [
    process.env.FRONTEND_URL,
    "https://easymeet.space",
    "https://www.easymeet.space",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
    "https://real-time-video-chat-app-inspired-by-zoom.vercel.app",
].filter(Boolean);

app.use(
    cors({
        origin(origin, callback) {
            if (!origin) return callback(null, true);

            if (
                allowedOrigins.includes(origin) ||
                origin.startsWith("http://localhost:") ||
                origin.startsWith("http://127.0.0.1:")
            ) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);

app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ extended: true, limit: "40kb" }));

app.use("/api/v1/users", userRoutes);

const start = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing");
        }

        console.log("Connecting to MongoDB...");

        const connection = await mongoose.connect(process.env.MONGO_URI);

        console.log(
            `MongoDB Connected: ${connection.connection.host}`
        );

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Database Connection Failed:");
        console.error(error);
        process.exit(1);
    }
};

start();