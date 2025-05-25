import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Copy,
  Check,
  Edit,
  Save,
  AlertCircle,
  DownloadIcon,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import axios from "axios";
import { BackendURL } from "@/contents/content";
import { formatDuration } from "./dashboard";
import { useAuth } from "@/context/AuthContext";

interface Segment {
  startTime: string;
  endTime: string;
  transcript: string;
  mcqs: MCQ[];
}

interface MCQ {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Video {
  id: string;
  filename: string;
  duration: number;
  segments: Segment[];
  date: string;
}

// Dummy data based on the provided schema
// const videoData = {
//   id: "video123",
//   filename: "Introduction to Computer Science.mp4",
//   duration: 3600, // 60 minutes
//   segments: [
//     {
//       startTime: "00:00",
//       endTime: "05:00",
//       transcript:
//         "Welcome to Introduction to Computer Science. In this lecture, we will cover the basics of programming, algorithms, and data structures. Programming is the process of creating a set of instructions that tell a computer how to perform a task. Algorithms are step-by-step procedures for solving problems. Data structures are ways of organizing and storing data for efficient access and modification. Let's start by discussing what a computer program is and how it works. A computer program is a sequence of instructions that a computer can execute. These instructions are written in programming languages, which are formal languages with specific syntax and semantics. There are many programming languages, such as Python, Java, C++, and JavaScript, each with its own strengths and weaknesses.",
//       mcqs: [
//         {
//           question: "What is programming?",
//           options: [
//             "The process of creating a set of instructions that tell a computer how to perform a task",
//             "The process of designing computer hardware",
//             "The process of creating user interfaces",
//             "The process of testing software",
//           ],
//           correctAnswer: "The process of creating a set of instructions that tell a computer how to perform a task",
//         },
//         {
//           question: "What are algorithms?",
//           options: [
//             "Programming languages",
//             "Step-by-step procedures for solving problems",
//             "Data storage methods",
//             "Computer hardware components",
//           ],
//           correctAnswer: "Step-by-step procedures for solving problems",
//         },
//         {
//           question: "Which of the following is NOT mentioned as a programming language in the lecture?",
//           options: ["Python", "Java", "Ruby", "JavaScript"],
//           correctAnswer: "Ruby",
//         },
//       ],
//     },
//     {
//       startTime: "05:00",
//       endTime: "10:00",
//       transcript:
//         "Now let's talk about variables and data types. Variables are containers for storing data values. In programming, variables have names and can store different types of data. Common data types include integers, floating-point numbers, strings, and booleans. Integers are whole numbers, like 1, 2, or 100. Floating-point numbers have decimal points, like 3.14 or 2.71. Strings are sequences of characters, like 'hello' or 'world'. Booleans can only have two values: true or false. Different programming languages have different ways of declaring variables. For example, in Python, you can simply write 'x = 5' to create a variable named 'x' with the value 5. In Java, you need to specify the data type, like 'int x = 5;'. Understanding variables and data types is fundamental to programming.",
//       mcqs: [
//         {
//           question: "What are variables in programming?",
//           options: [
//             "Functions that perform calculations",
//             "Containers for storing data values",
//             "Programming languages",
//             "Hardware components",
//           ],
//           correctAnswer: "Containers for storing data values",
//         },
//         {
//           question: "Which of the following is NOT a common data type mentioned in the lecture?",
//           options: ["Integers", "Floating-point numbers", "Arrays", "Booleans"],
//           correctAnswer: "Arrays",
//         },
//         {
//           question: "In Python, how do you declare a variable with the value 5?",
//           options: ["var x = 5;", "int x = 5;", "x = 5", "let x = 5;"],
//           correctAnswer: "x = 5",
//         },
//       ],
//     },
//     {
//       startTime: "10:00",
//       endTime: "15:00",
//       transcript:
//         "Let's move on to control structures. Control structures are programming constructs that control the flow of execution in a program. The three main types of control structures are sequence, selection, and iteration. Sequence is the default flow, where statements are executed one after another. Selection, also known as conditional statements, allows the program to choose different paths based on conditions. Common selection structures include if-else statements and switch statements. Iteration, also known as loops, allows the program to repeat a block of code multiple times. Common iteration structures include for loops and while loops. Control structures are essential for creating programs that can make decisions and perform repetitive tasks efficiently.",
//       mcqs: [
//         {
//           question: "What are control structures in programming?",
//           options: [
//             "Data storage methods",
//             "Programming languages",
//             "Programming constructs that control the flow of execution",
//             "Hardware components",
//           ],
//           correctAnswer: "Programming constructs that control the flow of execution",
//         },
//         {
//           question: "Which of the following is NOT a main type of control structure mentioned in the lecture?",
//           options: ["Sequence", "Selection", "Iteration", "Recursion"],
//           correctAnswer: "Recursion",
//         },
//         {
//           question: "What is another name for selection control structures?",
//           options: ["Loops", "Conditional statements", "Functions", "Variables"],
//           correctAnswer: "Conditional statements",
//         },
//       ],
//     },
//   ],
// }

function formatTimestamp(timestamp?: string): string {
  if (!timestamp) return "--:--"; // or return "" or "00:00" based on your design

  const [hours, minutes, rest] = timestamp.split(":");
  const [seconds] = rest.split(",");

  return `${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
}

export default function ResultsPage() {
  const { id } = useParams();
  const [activeSegment, setActiveSegment] = useState(0);
  const [videoData, setVideoData] = useState<Video>({
    id: "",
    filename: "",
    duration: 0,
    segments: [],
    date: "",
  });
  const [editingTranscript, setEditingTranscript] = useState(false);
  const [transcript, setTranscript] = useState(
    videoData.segments[0]?.transcript
  );
  const [editingMcq, setEditingMcq] = useState<number | null>(null);
  const [currentMcq, setCurrentMcq] = useState(videoData.segments[0]?.mcqs[0]);
  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [editingFilename, setEditingFilename] = useState(false);
  const [filename, setFilename] = useState(videoData.filename);
  const filenameInputRef = useRef<HTMLInputElement>(null);
  const { token } = useAuth();

  const fetchVideoData = async () => {
    try {
      const response = await axios.get(`${BackendURL}/api/video/${id}`);
      setVideoData(response.data);
    } catch (error) {
      console.error("Error fetching video data:", error);
    }
  };

  useEffect(() => {
    fetchVideoData();
  }, []);

  const handleCopyTranscript = () => {
    navigator.clipboard.writeText(videoData.segments[activeSegment].transcript);
    setCopied(true);
    toast.success("Copied to clipboard", {
      description: "Transcript has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTranscript = () => {
    const blob = new Blob([videoData.segments[activeSegment].transcript], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transcript.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveTranscript = () => {
    if (transcript.trim().length < 10) {
      setValidationError(
        "Transcript is too short. Please provide more content."
      );
      return;
    }

    // In a real app, you would save this to your backend
    setEditingTranscript(false);
    setValidationError(null);
    toast.success("Transcript saved", {
      description: "Your changes have been saved successfully.",
    });
  };

  const handleEditMcq = (index: number) => {
    setEditingMcq(index);
    setCurrentMcq({ ...videoData.segments[activeSegment].mcqs[index] });
    setValidationError(null);
  };

  const handleSaveMcq = () => {
    // Validate
    if (currentMcq.question.trim().length < 5) {
      setValidationError(
        "Question is too short. Please provide a proper question."
      );
      return;
    }

    if (currentMcq.options.some((opt) => opt.trim().length < 1)) {
      setValidationError("All options must have content.");
      return;
    }

    // In a real app, you would save this to your backend
    setEditingMcq(null);
    setValidationError(null);
    toast.success("MCQ saved", {
      description: "Your changes have been saved successfully.",
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const handleExportAllMcqs = () => {
    // Collect all MCQs from all segments
    const allMcqs = videoData.segments.flatMap((segment) => segment.mcqs);

    if (allMcqs.length === 0) {
      toast.warning("No MCQs to export", {
        description: "There are no MCQs available to export.",
      });
      return;
    }

    // Format the MCQs for export
    const formattedMcqs = allMcqs
      .map((mcq, index) => {
        return (
          `Question ${index + 1}: ${mcq.question}\n` +
          `Options:\n${mcq.options
            .map((opt, i) => `  ${i + 1}. ${opt}`)
            .join("\n")}\n` +
          `Correct Answer: ${mcq.correctAnswer}\n`
        );
      })
      .join("\n\n");

    // Create and download the file
    const blob = new Blob([formattedMcqs], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${videoData.filename.replace(/\.[^/.]+$/, "")}_MCQs.txt`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success("All MCQs exported", {
      description: "All MCQs have been exported successfully.",
    });
  };

  const handleExportSegmentMcqs = () => {
    const currentSegmentMcqs = videoData.segments[activeSegment]?.mcqs || [];

    if (currentSegmentMcqs.length === 0) {
      toast.warning("No MCQs to export", {
        description: "There are no MCQs available in this segment.",
      });
      return;
    }

    // Format the MCQs for export
    const formattedMcqs = currentSegmentMcqs
      .map((mcq, index) => {
        return (
          `Question ${index + 1}: ${mcq.question}\n` +
          `Options:\n${mcq.options
            .map((opt, i) => `  ${i + 1}. ${opt}`)
            .join("\n")}\n` +
          `Correct Answer: ${mcq.correctAnswer}\n`
        );
      })
      .join("\n\n");

    // Create and download the file
    const blob = new Blob([formattedMcqs], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${videoData.filename.replace(/\.[^/.]+$/, "")}_Segment_${
      activeSegment + 1
    }_MCQs.txt`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success("Segment MCQs exported", {
      description: `MCQs from segment ${
        activeSegment + 1
      } have been exported successfully.`,
    });
  };

  useEffect(() => {
    // Set initial filename when videoData changes
    setFilename(videoData.filename);
  }, [videoData.filename]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editingFilename &&
        filenameInputRef.current &&
        !filenameInputRef.current.contains(event.target as Node)
      ) {
        handleSaveFilename();
      }
    };

    if (editingFilename) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [editingFilename, filename]);

  const handleSaveFilename = async () => {
    if (filename.trim() === "") {
      setFilename(videoData.filename); // Revert to original if empty
      setEditingFilename(false);
      return;
    }

    if (filename !== videoData.filename) {
      try {
        await axios.patch(
          `${BackendURL}/api/video/${id}`,
          {
            filename,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Assuming you have a token in user context
            },
          }
        );
        setVideoData({ ...videoData, filename });
        toast.success("Filename updated successfully");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 400) {
            toast.error("Invalid filename. Please try again.");
            return;
          }
          if (error.response?.status === 500) {
            toast.error("Server error. Please try again.");
            return;
          }

          if (error.response?.status === 404) {
            toast.error("Video not found. Please refresh the page.");
            return;
          }
        }
        console.error("Error updating filename:", error);
        toast.error("Failed to update filename");
        setFilename(videoData.filename); // Revert on error
      }
    }
    setEditingFilename(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-12 px-4"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mb-8 flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <div className="flex items-center">
            {editingFilename ? (
              <input
                ref={filenameInputRef}
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSaveFilename();
                  } else if (e.key === "Escape") {
                    setFilename(videoData.filename);
                    setEditingFilename(false);
                  }
                }}
                onBlur={handleSaveFilename}
                autoFocus
                className="text-3xl font-bold px-1 -ml-1 bg-transparent border-2 rounded-md border-black dark:border-white focus:outline-none focus:ring-0 h-auto leading-snug"
                style={{
                  // Match line height of h1
                  lineHeight: "1.5",
                  // Prevent resizing height
                  height: "auto",
                }}
                 maxLength={25}
              />
            ) : (
              <motion.h1
               title="Click to edit name"
                variants={item}
                className="text-3xl font-bold cursor-text hover:bg-accent/50 rounded px-1 -ml-1"
                onClick={() => {
                  setEditingFilename(true);
                  setTimeout(() => filenameInputRef.current?.focus(), 0);
                }}
              >
                {videoData.filename}
              </motion.h1>
            )}
          </div>

          <motion.div
            variants={item}
            className="flex flex-wrap gap-4 text-sm text-muted-foreground"
          >
            <div>Duration: {formatDuration(videoData.duration)}</div>
            <div>Segments: {videoData.segments.length}</div>
            <div>
              MCQs:{" "}
              {videoData.segments.reduce(
                (acc, segment) => acc + segment.mcqs.length,
                0
              )}
            </div>
          </motion.div>
        </div>

        <motion.div variants={item}>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleExportAllMcqs}
          >
            Export All MCQs
            <DownloadIcon className="w-4 h-4" />
          </Button>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Video Segments</CardTitle>
              <CardDescription>
                Select a segment to view its transcript and MCQs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {videoData.segments.map((segment, index) => (
                  <Button
                    key={index}
                    variant={activeSegment === index ? "default" : "outline"}
                    className={`w-full justify-start transition-all duration-200 ${
                      activeSegment === index ? "shadow-sm" : ""
                    }`}
                    onClick={() => {
                      setActiveSegment(index);
                      setTranscript(segment.transcript);
                      setEditingTranscript(false);
                      setEditingMcq(null);
                      setValidationError(null);
                    }}
                  >
                    <span>
                      {formatTimestamp(segment.startTime)} -{" "}
                      {formatTimestamp(segment.endTime)}
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Tabs defaultValue="transcript">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
              <TabsTrigger value="mcqs">MCQs</TabsTrigger>
            </TabsList>

            <TabsContent value="transcript">
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Transcript</CardTitle>
                    <CardDescription>
                      Segment {activeSegment + 1}:{" "}
                      {formatTimestamp(
                        videoData.segments[activeSegment]?.startTime || ""
                      )}
                      -{" "}
                      {formatTimestamp(
                        videoData.segments[activeSegment]?.endTime || ""
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {!editingTranscript ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopyTranscript}
                        >
                          {copied ? (
                            <Check className="h-4 w-4 mr-1" />
                          ) : (
                            <Copy className="h-4 w-4 mr-1" />
                          )}
                          {copied ? "Copied" : "Copy"}
                        </Button>
                        {/* <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingTranscript(true)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button> */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownloadTranscript}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleSaveTranscript}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {validationError && editingTranscript && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{validationError}</AlertDescription>
                    </Alert>
                  )}

                  {editingTranscript ? (
                    <Textarea
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      className="min-h-[200px]"
                    />
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-muted p-4 rounded-lg"
                    >
                      <p className="whitespace-pre-wrap">
                        {videoData.segments[activeSegment]?.transcript}
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mcqs">
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Multiple Choice Questions</CardTitle>
                    <CardDescription>
                      {videoData.segments[activeSegment]?.mcqs.length} questions
                      for segment {activeSegment + 1}
                    </CardDescription>
                  </div>
                  {videoData.segments[activeSegment]?.mcqs.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportSegmentMcqs}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export All
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {videoData.segments[activeSegment]?.mcqs.map(
                      (mcq, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border rounded-lg p-4 transition-all duration-200 hover:shadow-sm"
                        >
                          {editingMcq === index ? (
                            <div className="space-y-4">
                              {validationError && (
                                <Alert variant="destructive" className="mb-2">
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertTitle>Error</AlertTitle>
                                  <AlertDescription>
                                    {validationError}
                                  </AlertDescription>
                                </Alert>
                              )}

                              <div>
                                <Label htmlFor={`question-${index}`}>
                                  Question
                                </Label>
                                <Input
                                  id={`question-${index}`}
                                  value={currentMcq.question}
                                  onChange={(e) =>
                                    setCurrentMcq({
                                      ...currentMcq,
                                      question: e.target.value,
                                    })
                                  }
                                  className="mt-1"
                                />
                              </div>

                              <div>
                                <Label>Options</Label>
                                {currentMcq?.options.map((option, optIndex) => (
                                  <div
                                    key={optIndex}
                                    className="flex items-center gap-2 mt-2"
                                  >
                                    <RadioGroupItem
                                      value={option}
                                      id={`option-${index}-${optIndex}`}
                                      checked={
                                        option === currentMcq.correctAnswer
                                      }
                                      disabled={
                                        option === currentMcq.correctAnswer
                                          ? false
                                          : true
                                      }
                                      onClick={() =>
                                        setCurrentMcq({
                                          ...currentMcq,
                                          correctAnswer: option,
                                        })
                                      }
                                    />
                                    <Input
                                      value={option}
                                      onChange={(e) => {
                                        const newOptions = [
                                          ...currentMcq.options,
                                        ];
                                        newOptions[optIndex] = e.target.value;
                                        setCurrentMcq({
                                          ...currentMcq,
                                          options: newOptions,
                                        });
                                      }}
                                      className="flex-1"
                                    />
                                  </div>
                                ))}
                              </div>

                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setEditingMcq(null);
                                    setValidationError(null);
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button onClick={handleSaveMcq}>
                                  Save Changes
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex justify-between mb-2">
                                <h3 className="font-medium">
                                  Question {index + 1}
                                </h3>
                                {/* <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditMcq(index)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button> */}
                              </div>
                              <p className="mb-4">{mcq.question}</p>
                              <RadioGroup defaultValue={mcq.correctAnswer}>
                                {mcq.options.map((option, optIndex) => (
                                  <div
                                    key={optIndex}
                                    className="flex items-start space-x-2 mb-2"
                                  >
                                    <RadioGroupItem
                                      value={option}
                                      id={`q${index}-opt${optIndex}`}
                                      disabled={option !== mcq.correctAnswer}
                                    />
                                    <Label
                                      htmlFor={`q${index}-opt${optIndex}`}
                                      className={`${
                                        option === mcq.correctAnswer
                                          ? "font-medium text-green-600 dark:text-green-400"
                                          : ""
                                      }`}
                                    >
                                      {option}
                                      {option === mcq.correctAnswer &&
                                        " (Correct)"}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </>
                          )}
                        </motion.div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
}
