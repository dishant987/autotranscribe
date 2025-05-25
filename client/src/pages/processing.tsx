import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function ProcessingPage() {
  const [transcriptionProgress, setTranscriptionProgress] = useState(0);
  const [mcqProgress, setMcqProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState<
    "uploading" | "transcribing" | "generating" | "complete"
  >("uploading");
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate upload completion
    setTimeout(() => {
      setCurrentStage("transcribing");
      toast.loading("Transcription started", {
        description: "Converting your video to text...",
      });

      simulateProgress(setTranscriptionProgress, () => {
        setCurrentStage("generating");
        toast.loading("Transcription complete", {
          description: "Now generating MCQs from your content...",
        });

        simulateProgress(setMcqProgress, () => {
          setCurrentStage("complete");
          toast.loading("Processing complete", {
            description: "Your video has been processed successfully!",
          });

          setTimeout(() => {
            navigate("/results/video123");
          }, 1500);
        });
      });
    }, 2000);
  }, [navigate, toast]);

  const simulateProgress = (
    setProgress: React.Dispatch<React.SetStateAction<number>>,
    onComplete: () => void
  ) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 5;
      if (progress > 100) {
        progress = 100;
        clearInterval(interval);
        onComplete();
      }
      setProgress(progress);
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-12 px-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Processing Your Video</CardTitle>
            <CardDescription>
              Please wait while we process your video. This may take a few
              minutes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`rounded-full p-1 ${
                      currentStage === "uploading"
                        ? "bg-primary text-primary-foreground"
                        : "bg-green-100 dark:bg-green-900"
                    }`}
                  >
                    {currentStage === "uploading" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="h-4 w-4 rounded-full bg-green-500"
                      />
                    )}
                  </div>
                  <span className="font-medium">Upload Complete</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {currentStage === "uploading" ? "In progress..." : "Done"}
                </span>
              </motion.div>

              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`rounded-full p-1 ${
                      currentStage === "transcribing"
                        ? "bg-primary text-primary-foreground"
                        : currentStage === "uploading"
                        ? "bg-muted"
                        : "bg-green-100 dark:bg-green-900"
                    }`}
                  >
                    {currentStage === "transcribing" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : currentStage === "uploading" ? (
                      <div className="h-4 w-4" />
                    ) : (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="h-4 w-4 rounded-full bg-green-500"
                      />
                    )}
                  </div>
                  <span className="font-medium">Transcribing Video</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {currentStage === "uploading"
                    ? "Waiting..."
                    : currentStage === "transcribing"
                    ? `${Math.round(transcriptionProgress)}%`
                    : "Done"}
                </span>
              </motion.div>

              {currentStage === "transcribing" && (
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Progress value={transcriptionProgress} className="h-2" />
                </motion.div>
              )}

              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`rounded-full p-1 ${
                      currentStage === "generating"
                        ? "bg-primary text-primary-foreground"
                        : currentStage === "uploading" ||
                          currentStage === "transcribing"
                        ? "bg-muted"
                        : "bg-green-100 dark:bg-green-900"
                    }`}
                  >
                    {currentStage === "generating" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : currentStage === "uploading" ||
                      currentStage === "transcribing" ? (
                      <div className="h-4 w-4" />
                    ) : (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="h-4 w-4 rounded-full bg-green-500"
                      />
                    )}
                  </div>
                  <span className="font-medium">Generating MCQs</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {currentStage === "uploading" ||
                  currentStage === "transcribing"
                    ? "Waiting..."
                    : currentStage === "generating"
                    ? `${Math.round(mcqProgress)}%`
                    : "Done"}
                </span>
              </motion.div>

              {currentStage === "generating" && (
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Progress value={mcqProgress} className="h-2" />
                </motion.div>
              )}
            </div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="rounded-lg bg-muted p-4 text-center"
            >
              <p className="text-sm text-muted-foreground">
                {currentStage === "uploading" &&
                  "Preparing your video for processing..."}
                {currentStage === "transcribing" &&
                  "Converting speech to text. This may take a few minutes depending on video length..."}
                {currentStage === "generating" &&
                  "Creating multiple-choice questions based on the video content..."}
                {currentStage === "complete" &&
                  "Processing complete! Redirecting to results..."}
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
