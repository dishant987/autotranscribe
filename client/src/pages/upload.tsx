import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileVideo, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";
import { BackendURL } from "@/contents/content";
import { useAuth } from "@/context/AuthContext";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    handleFileSelection(droppedFile);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        console.log(e.target.files[0]);
        handleFileSelection(e.target.files[0]);
      }
    },
    []
  );

  const handleFileSelection = (selectedFile: File) => {
    setError(null);

    // Check if file is an MP4
    if (selectedFile.type !== "video/mp4") {
      setError("Please upload an MP4 video file.");
      toast.error("Invalid file format", {
        description: "Please upload an MP4 video file.",
      });
      return;
    }

    // Check file size (limit to 300MB for example)
    if (selectedFile.size > 300 * 1024 * 1024) {
      setError("File size exceeds 300MB limit.");
      toast.error("File too large", {
        description: "File size exceeds 300MB limit.",
      });
      return;
    }

    setFile(selectedFile);
    toast.success("File selected", {
      description: `${selectedFile.name} is ready to upload.`,
    });
  };

  const handleUpload = useCallback(() => {
    if (!file) return;
    const formData = new FormData();
    formData.append("video", file);

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    const uploadToast = toast.loading("Upload started and processing", {
      description:
        "Your video is being uploaded and processed. This might take some time. Please wait...",
    });

    axios
      .post(`${BackendURL}/api/video/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Assuming you have a token in user context
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress(percentCompleted);
        },
      })
      .then((response) => {
        if (response.status === 200) {
          toast.dismiss(uploadToast);
          toast.success("Upload complete", {
            description: "Your video has been uploaded successfully.",
          });
          setTimeout(() => {
            setIsUploading(false);
            navigate("/dashboard");
          }, 500);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Upload failed.");
        toast.error("Upload failed", {
          description: "There was a problem uploading your video.",
        });
        setIsUploading(false);
        toast.dismiss(uploadToast);
      })
      .finally(() => {
        setFile(null);
        setUploadProgress(0);
        toast.dismiss(uploadToast);
        setIsUploading(false);
      });
  }, [file, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-12 px-4"
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-3xl font-bold mb-8 text-center"
      >
        Upload Your Lecture Video
      </motion.h1>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl mx-auto"
      >
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Video Upload</CardTitle>
            <CardDescription>
              Upload an MP4 video file to generate a transcript and MCQs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              whileHover={{ scale: isDragging ? 1 : 1.01 }}
              className={`border-2 border-dashed rounded-lg p-12 text-center ${
                isDragging ? "border-primary bg-primary/5" : "border-border"
              } transition-colors duration-200`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {file ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-center">
                    <FileVideo className="h-12 w-12 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <Upload className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Drag and drop your video here</p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse (MP4 format, max 300MB)
                    </p>
                  </div>
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() =>
                        document.getElementById("video-upload")?.click()
                      }
                    >
                      Browse Files
                    </Button>
                    <Input
                      id="video-upload"
                      type="file"
                      accept="video/mp4"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              )}
            </motion.div>

            {/* {isUploading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 space-y-2"
              >
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </motion.div>
            )} */}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setFile(null);
                toast.success("Upload cancelled", {
                  description: "Your file has been removed.",
                });
              }}
              disabled={!file || isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="relative overflow-hidden"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Video"
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
}
