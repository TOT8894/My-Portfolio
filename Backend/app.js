import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import errorHandler from "./middleware/errorHandler.js";
import dotenv from "dotenv";
dotenv.config();
import { CLIENT_URL } from "./config/env.js";
import contactRoutes from "./route/contactRoute.js";
const app = express();

// Middlewares
app.use(cors({ origin: CLIENT_URL}, { credentials: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet())

// Routes
app.use("/api/v1/contact", contactRoutes);


// Error handler
app.use(errorHandler);

export default app;