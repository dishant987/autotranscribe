# EduVid AI - Video Learning Platform

Transform your lecture videos into interactive learning experiences with automatic transcription and MCQ generation.

## 📽️ Demo Video

Watch a demo of EduVid AI in action:  
[▶️ View Demo on Google Drive](https://drive.google.com/file/d/18IYgCc_9wDg34_NDoy31_ofv_91kqwwc/view?usp=drive_link)

## 🚀 Features

- **Video Upload**: Support for MP4 video files up to 300MB
- **Automatic Transcription**: Convert speech to text using Whisper AI
- **Smart Segmentation**: Break videos into 5-minute segments for better navigation
- **MCQ Generation**: AI-powered multiple-choice question creation
- **User Authentication**: Secure login and registration system
- **Dashboard**: Manage all your videos and generated content
- **Export Functionality**: Download transcripts and MCQs
- **Responsive Design**: Works seamlessly on desktop and mobile

## 📁 Project Structure

```
eduvid-ai/
├── client/                    # Frontend (React + TypeScript)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # shadcn/ui components
│   │   │   ├── layout.tsx     # Main layout wrapper
│   │   │   ├── navbar.tsx     # Navigation component
│   │   │   └── footer.tsx     # Footer component
│   │   ├── pages/             # Page components
│   │   │   ├── home.tsx       # Landing page
│   │   │   ├── upload.tsx     # Video upload page
│   │   │   ├── dashboard.tsx  # User dashboard
│   │   │   ├── results.tsx    # Video results page
│   │   │   ├── login.tsx      # Login page
│   │   │   └── signup.tsx     # Registration page
│   │   ├── context/           # React contexts
│   │   │   └── AuthContext.tsx # Authentication context
│   │   ├── lib/               # Utility functions
│   │   └── contents/          # Configuration files
│   ├── package.json
│   └── vite.config.ts
│
├── server/                    # Backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/       # Route controllers
│   │   │   ├── authController.ts    # Authentication logic
│   │   │   └── videoController.ts   # Video processing logic
│   │   ├── middleware/        # Express middleware
│   │   │   └── authMiddleware.ts    # JWT authentication
│   │   ├── models/            # Database models
│   │   │   ├── User.ts        # User schema
│   │   │   └── Video.ts       # Video schema
│   │   ├── routes/            # API routes
│   │   │   ├── authRoutes.ts  # Authentication routes
│   │   │   └── videoRoutes.ts # Video routes
│   │   ├── utils/             # Utility functions
│   │   │   ├── transcription.ts     # Whisper integration
│   │   │   └── mcqGenerator.ts      # LLM integration
│   │   ├── app.ts             # Express app configuration
│   │   └── server.ts          # Server entry point
│   ├── uploads/               # Temporary file storage
│   ├── transcripts/           # Generated transcripts
│   └── package.json
│
└── README.md                   # This file
```

## 🛠️ Tech Stack

### Frontend (client)
- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **Framer Motion** for animations
- **Axios** for API calls
- **Sonner** for notifications

### Backend (server2)
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Multer** for file uploads
- **Whisper AI** for transcription
- **Ollama/LLaMA** for MCQ generation

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **MongoDB** (local or cloud instance)
- **Python** (for Whisper AI)
- **FFmpeg** (for video processing)
- **Whisper AI** (`pip install openai-whisper`)
- **Ollama** (for LLM integration)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/eduvid-ai.git
cd eduvid-ai
```

### 2. Backend Setup (server)

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
LLM_API_URL=http://127.0.0.1:11434/api/generate
MONGO_URI=mongodb://127.0.0.1:27017/videoqa
JWT_SECRET=your_super_secret_jwt_key_here
```

Create required directories:

```bash
mkdir uploads transcripts
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup (client)

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_BACKEND_URL=http://localhost:5000
```

Start the frontend development server:

```bash
npm run dev
```

### 4. Additional Setup

#### Install Whisper AI
```bash
pip install openai-whisper
```

#### Install and Setup Ollama
1. Download Ollama from [https://ollama.ai](https://ollama.ai)
2. Install the LLaMA model:
```bash
ollama pull llama3
```
3. Start Ollama server:
```bash
ollama serve
```

#### Install FFmpeg
- **Windows**: Download from [https://ffmpeg.org](https://ffmpeg.org) and add to PATH
- **macOS**: `brew install ffmpeg`
- **Linux**: `sudo apt install ffmpeg`

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
- `PORT`: Server port (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `LLM_API_URL`: Ollama API endpoint

#### Frontend (.env)
- `VITE_BACKEND_URL`: Backend API URL

### File Upload Limits
- Maximum file size: 300MB
- Supported format: MP4 only
- Processing time: Varies based on video length

## 📖 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Video Endpoints

#### POST /api/video/upload
Upload and process a video file.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `video`: MP4 file (max 300MB)

#### GET /api/video/videos
Get all videos for authenticated user.

#### GET /api/video/:id
Get specific video with transcripts and MCQs.

#### DELETE /api/video/:id
Delete a video and its associated data.

#### PATCH /api/video/:id
Update video filename.

#### GET /api/video/dashboard/data
Get dashboard statistics.

## 🎯 Usage

1. **Register/Login**: Create an account or sign in
2. **Upload Video**: Navigate to upload page and select an MP4 file
3. **Processing**: Wait for automatic transcription and MCQ generation
4. **Review Results**: View transcripts and generated questions
5. **Export Data**: Download transcripts and MCQs as needed
6. **Manage Content**: Use dashboard to organize your videos

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- File type validation
- File size limits
- Protected routes
- Input validation and sanitization

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the project:
```bash
cd client
npm run build
```

2. Deploy the `dist` folder to your hosting platform

### Backend Deployment (Railway/Heroku)

1. Set environment variables on your hosting platform
2. Ensure MongoDB is accessible
3. Install system dependencies (FFmpeg, Python, Whisper)
4. Deploy the `server` directory

## 🐛 Known Issues

- Large video files may take significant time to process
- Whisper AI requires substantial system resources
- LLM responses may occasionally need manual review


## 🙏 Acknowledgments

- [OpenAI Whisper](https://github.com/openai/whisper) for transcription
- [Ollama](https://ollama.ai) for LLM integration
- [shadcn/ui](https://ui.shadcn.com) for UI components
- [Tailwind CSS](https://tailwindcss.com) for styling

---

**Made with ❤️ by Dishant**
```

This README provides comprehensive documentation for your EduVid AI project, including:

1. **Clear project overview** with features and tech stack
2. **Detailed folder structure** explaining the organization
3. **Step-by-step installation** instructions for both frontend and backend
4. **Configuration details** for environment variables and dependencies
5. **API documentation** with request/response examples
6. **Usage instructions** for end users
7. **Deployment guidelines** for production

```