import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';


import { connectMongoDB } from './db/connectMongoDB.js';
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { logger } from "./middleware/logger.js";
import notesRoutes from "./routes/notesRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    methods: ["GET", "POST", "PATCH", "DELETE"],
    origin: "*",
  }));
app.use(express.json());
app.use(helmet());
app.use(logger);

app.use(cookieParser());

app.use(notesRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
    console.log(`Server is running on localhost: ${PORT}`);
});