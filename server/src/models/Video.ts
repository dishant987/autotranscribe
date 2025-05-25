import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // Assuming user ID is stored
    filename: { type: String, required: true },
    duration: { type: Number, required: true }, // in seconds or minutes

    segments: [
      {
        startTime: { type: String, required: true }, // e.g., "00:00"
        endTime: { type: String, required: true }, // e.g., "05:00"
        transcript: { type: String, required: true },

        mcqs: [
          {
            question: { type: String, required: true },
            options: [{ type: String, required: true }],
            correctAnswer: { type: String, required: true },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const VideoModel = mongoose.model("Video", VideoSchema);
export default VideoModel;
