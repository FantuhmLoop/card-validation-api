import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import validationRoutes from "./routes/validation.routes.ts";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware.ts";
import { logger } from "./middleware/logger.middelware.ts";

export const createApp = (): Application => {
  const app = express();

  // Logging middleware
  app.use(logger);

  // Security middleware
  app.use(helmet());
  app.use(cors());

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use("/api/v1", validationRoutes);

  // Health check
  app.get("/health", (_req, res) => {
    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
    });
  });

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
