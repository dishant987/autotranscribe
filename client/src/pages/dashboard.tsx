import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileVideo, Clock, BarChart, Upload, Eye, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { BackendURL } from "@/contents/content";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface Video {
  id: string;
  filename: string;
  duration: number;
  segments: number;
  mcqs: number;
  date: string;
}

interface DashboardData {
  totalDuration: number;
  totalMcqs: number;
  totalVideos: number;
}

// Dummy data
// const recentVideos = [
//   {
//     id: "video123",
//     filename: "Introduction to Computer Science.mp4",
//     duration: 3600,
//     segments: 12,
//     mcqs: 36,
//     date: "2023-05-15",
//   },
//   {
//     id: "video456",
//     filename: "Data Structures and Algorithms.mp4",
//     duration: 4800,
//     segments: 16,
//     mcqs: 48,
//     date: "2023-05-10",
//   },
//   {
//     id: "video789",
//     filename: "Web Development Fundamentals.mp4",
//     duration: 3000,
//     segments: 10,
//     mcqs: 30,
//     date: "2023-05-05",
//   },
// ];

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  return `${hours > 0 ? `${hours}h ` : ""}${minutes % 60}m`;
};

export default function DashboardPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalDuration: 0,
    totalMcqs: 0,
    totalVideos: 0,
  });
  const {token} = useAuth();

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${BackendURL}/api/video/videos`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Videos response:", response.data);
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(
        `${BackendURL}/api/video/dashboard/data`,{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Dashboard data response:", response.data);
      if (response.status === 200) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchVideos();
    fetchDashboardData();
  }, []);

  const deleteVideo = async (videoId: string, filename: string) => {
    try {
      const response = await axios.delete(`${BackendURL}/api/video/${videoId}`);
      if (response.status === 200) {
        setVideos((prevVideos) =>
          prevVideos.filter((video) => video.id !== videoId)
        );
        fetchDashboardData();
        toast.success(`Video "${filename}" deleted successfully.`, {
          description: "The video has been removed from your dashboard.",
        });
      }
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Manage your videos and MCQs</p>
        </div>
        <Button asChild>
          <Link to="/upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload New Video
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <FileVideo className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dashboardData.totalVideos}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Duration
            </CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatDuration(dashboardData.totalDuration)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total MCQs</CardTitle>
            <BarChart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData.totalMcqs}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent">
        <TabsList className="mb-6 ">
          <TabsTrigger value="recent">All Videos</TabsTrigger>
        </TabsList>

        <TabsContent value="recent">
          <div className="grid grid-cols-1 gap-6">
            {videos.map((video) => (
              <Card key={video.id}>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-3 aspect-video bg-gray-100 dark:bg-gray-800 border rounded-r-lg relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileVideo className="h-12 w-12 text-gray-400" />
                      </div>
                    </div>
                    <div className="md:col-span-9 p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                        <h3 className="text-xl font-semibold">
                          <Link
                            to={`/results/${video.id}`}
                            className="hover:text-primary"
                          >
                            {video.filename}
                          </Link>
                        </h3>
                        <div className="text-sm text-gray-500">
                          Uploaded on {formatDate(video.date)}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-500">Duration</div>
                          <div className="font-medium">
                            {formatDuration(video.duration)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Segments</div>
                          <div className="font-medium">{video.segments}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">MCQs</div>
                          <div className="font-medium">{video.mcqs}</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="gap-1"
                        >
                          <Link to={`/results/${video.id}`}>
                            <Eye className="w-4 h-4" />
                            View Details
                          </Link>
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="gap-1">
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Delete {video.filename}</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this video? This
                                action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>

                            <DialogFooter>
                              <Button
                                type="submit"
                                onClick={() =>
                                  deleteVideo(video.id, video.filename)
                                }
                              >
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium mb-2">All Videos</h3>
            <p className="text-gray-500 mb-4">
              This tab would display all your uploaded videos with filtering and
              sorting options.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="mcqs">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium mb-2">MCQ Library</h3>
            <p className="text-gray-500 mb-4">
              This tab would display all generated MCQs across all videos with
              search and filtering options.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
