import { Request, Response } from "express";
import fs from "fs";
import { transcribeVideo } from "../utils/transcription";
import { generateMCQs } from "../utils/mcqGenerator";
import VideoModel from "../models/Video";
import User from "../models/User";

export const uploadVideo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const file = req.file;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized: User not found" });
      return;
    }

    const user = await User.findById(userId); // Don't forget to `await` this
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const segments = await transcribeVideo(file.path, "transcripts");
    if (!segments || segments.length === 0) {
      res.status(400).json({ error: "No segments found in the video" });
      return;
    }

    // Run MCQ generation in parallel for all segments
    const mcqPromises = segments.map(async (segment) => {
      try {
        const mcqText = await generateMCQs(segment.transcript);
        const mcqs = JSON.parse(mcqText);

        return {
          startTime: segment.startTime,
          endTime: segment.endTime,
          transcript: segment.transcript,
          mcqs,
        };
      } catch (err) {
        console.warn("Failed to generate MCQs for segment:", err);
        return {
          startTime: segment.startTime,
          endTime: segment.endTime,
          transcript: segment.transcript,
          mcqs: [],
        };
      }
    });

    const segmentsWithMcqs = await Promise.all(mcqPromises);

    const saved = await VideoModel.create({
      userId,
      filename: file.originalname,
      duration: segments.length * 60,
      segments: segmentsWithMcqs,
    });

    fs.unlinkSync(file.path);

    res.status(200).json({
      saved,
      message: "Video uploaded and processed successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Processing failed." });
  }
};

// Function to get all videos
// This function retrieves all videos from the database
export const getVideos = async (req: Request, res: Response): Promise<void> => {
  try {
    const videos = await VideoModel.find();

    const formattedVideos = videos.map((video) => {
      const mcqCount = video.segments.reduce((total, segment) => {
        return total + (segment.mcqs?.length || 0);
      }, 0);

      return {
        id: video._id.toString(),
        filename: video.filename,
        duration: video.duration,
        segments: video.segments.length,
        mcqs: mcqCount,
        date: video.createdAt.toISOString().split("T")[0], // format: "YYYY-MM-DD"
      };
    });
    res.status(200).json(formattedVideos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch video data." });
  }
};

// Function to get a video by ID
// This function retrieves a video by its ID from the database
export const getVideoById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const video = await VideoModel.findById(id);
    if (!video) {
      res.status(404).json({ error: "Video not found" });
      return;
    }
    res.status(200).json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch video." });
  }
};

// Function to delete a video
// This function deletes a video by its ID from the database
export const deleteVideo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const video = await VideoModel.findByIdAndDelete(id);
    if (!video) {
      res.status(404).json({ error: "Video not found" });
      return;
    }
    res.status(200).json({ message: "Video deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete video." });
  }
};

// Function to update video filename

export const updateVideoFilename = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { filename } = req.body;

    if (!filename || typeof filename !== "string") {
       res.status(400).json({ error: "Valid filename is required" });
      return;
    }

    const updatedVideo = await VideoModel.findByIdAndUpdate(
      id,
      { filename },
      { new: true }
    );

    if (!updatedVideo) {
       res.status(404).json({ error: "Video not found" });
      return;
    }

    res.json(updatedVideo);
  } catch (error) {
    console.error("Error updating filename:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Function to show dashboard data
// This function retrieves the dashboard data
export const showDashboardData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const videos = await VideoModel.find();

    const totalVideos = videos.length;
    let totalDuration = 0;
    let totalMcqs = 0;

    videos.forEach((video) => {
      totalDuration += video.duration;

      video.segments.forEach((segment) => {
        totalMcqs += segment.mcqs?.length || 0;
      });
    });

    res.status(200).json({
      totalVideos,
      totalDuration, // in whatever unit you're using (e.g., seconds)
      totalMcqs,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data." });
  }
};
