import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import pino from "pino-http";
import { connectMongoDB } from './db/connectMongoDB.js';
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { logger } from "./middleware/logger.js";
import notesRoutes from "./routes/notesRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// middleware

app.use(cors({
    methods: ["GET", "POST", "PATCH", "DELETE"],
    origin: "*",
  }));
app.use(express.json());
app.use(helmet());
app.use(pino());

app.use(notesRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

// test route

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.get("/notes", (req, res) => {
  res.status(200).json({
    message: "Retrieved all notes",
  });
});

app.get("/notes/:noteId", (req, res) => {
  const { noteId } = req.params;

  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// підключення до MongoDB

await connectMongoDB();

// START SERVER

app.listen(PORT, () => {
    console.log(`Server is running on localhost: ${PORT}`);
});