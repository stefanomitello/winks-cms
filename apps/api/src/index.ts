import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import blogRoutes from "./routes/blog.routes";
import cmsRoutes from "./routes/cms.routes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3001;
const MONGODB_URI =
  process.env.MONGODB_URI ?? "mongodb://localhost:27017/winks-cms";

import path from "path";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WinksAPI",
      version: "1.0.0",
      description: "Documentazione API",
    },
  },
  apis: [path.join(__dirname, "./routes/*.ts")],
};
const swaggerSpec = swaggerJsdoc(options);

app.use(cors());
app.use(express.json());

app.use("/api/blog", blogRoutes);
app.use("/api/cms", cmsRoutes);
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorHandler);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected:", MONGODB_URI);
    app.listen(PORT, () =>
      console.log(`🚀 API running → http://localhost:${PORT}`),
    );
  })
  .catch((err: Error) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
