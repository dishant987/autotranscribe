import express from "express";
import cors from "cors";
import videoRoutes from "./routes/videoRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/video", videoRoutes);
app.use("/api/auth", authRoutes);

export default app;
