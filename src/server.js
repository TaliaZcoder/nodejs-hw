import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import pino from "pino-http";
import { connectMongoDB } from './db/connectMongoDB.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// middleware

app.use(cors());
app.use(express.json());
app.use(pino());

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

// 404 MIDDLEWARE

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// 500 ERROR HANDLER

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: err.message,
  });
});

// підключення до MongoDB

await connectMongoDB();

// START SERVER

app.listen(PORT, () => {
    console.log(`Server is running on localhost: ${PORT}`);
});