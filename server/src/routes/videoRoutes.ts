import express from "express";
import multer from "multer";
import {
  deleteVideo,
  getVideoById,
  getVideos,
  showDashboardData,
  updateVideoFilename,
  uploadVideo,
} from "../controllers/videoController";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({
  storage,
  limits: { fileSize: 300 * 1024 * 1024 }, // 300MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "video/mp4") cb(null, true);
    else cb(new Error("Only MP4 files are allowed"));
  },
});

// Helper to wrap async route handlers and forward errors to Express
const asyncHandler =
  (fn: express.RequestHandler) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.post(
  "/upload",
  verifyToken,
  upload.single("video"),
  asyncHandler(uploadVideo)
);
router.get("/videos", verifyToken, getVideos);
router.get("/:id", getVideoById);
router.delete("/:id", deleteVideo);
router.get("/dashboard/data", verifyToken, showDashboardData);
router.patch("/:id", verifyToken, updateVideoFilename);

export default router;
