import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import srtParser2 from "srt-parser-2";

function parseSRT(filePath: string): {
  startTime: string;
  endTime: string;
  transcript: string;
}[] {
  console.log(" parseSRT: Transcribing video with Whisper...");
  const parser = new srtParser2();
  const srtContent = fs.readFileSync(filePath, "utf-8");
  const cues = parser.fromSrt(srtContent);

  const segments: {
    startTime: string;
    endTime: string;
    transcript: string;
  }[] = [];

  let currentSegment: string[] = [];
  let segmentStart = cues[0]?.startTime;
  let lastTime = segmentStart;

  const maxSegmentDuration = 5 * 60; // in 5 minutes

  const timeToSeconds = (time: string) => {
    const [h, m, s] = time.replace(",", ".").split(":").map(parseFloat);
    return h * 3600 + m * 60 + s;
  };

  for (let i = 0; i < cues.length; i++) {
    const cue = cues[i];
    currentSegment.push(cue.text);

    const currentDuration =
      timeToSeconds(cue.endTime) - timeToSeconds(segmentStart);
    if (currentDuration >= maxSegmentDuration || i === cues.length - 1) {
      segments.push({
        startTime: segmentStart,
        endTime: cue.endTime,
        transcript: currentSegment.join(" "),
      });

      currentSegment = [];
      segmentStart = cues[i + 1]?.startTime || cue.endTime;
    }
  }

  return segments;
}

export function transcribeVideo(
  filePath: string,
  outputDir: string
): Promise<
  {
    startTime: string;
    endTime: string;
    transcript: string;
  }[]
> {
  return new Promise((resolve, reject) => {
    console.log("Transcribing video with Whisper...");
    const ffmpegDir = "C:\\ffmpeg\\bin"; // ✅ adjust if needed

    const absoluteInputPath = path.resolve(filePath);
    if (!fs.existsSync(absoluteInputPath)) {
      return reject(new Error(`Input file not found: ${absoluteInputPath}`));
    }

    const inputBaseName = path.parse(filePath).name;
    const srtOutputPath = path.join(outputDir, `${inputBaseName}.srt`);
    if (!fs.existsSync(absoluteInputPath)) {
      return reject(new Error(`Input file not found: ${absoluteInputPath}`));
    }
    const whisperArgs = [
      absoluteInputPath,
      "--model",
      "base",
      "--language",
      "en",
      "--output_dir",
      outputDir,
      "--output_format",
      "srt",
    ];

    const whisper = spawn("whisper", whisperArgs);

    let stdout = "";
    let stderr = "";
    whisper.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    whisper.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    whisper.on("close", (code) => {
      console.log("Whisper stdout:", stdout);
      console.log("Whisper stderr:", stderr);

      if (code !== 0) {
        return reject(new Error(`Whisper failed (code ${code}).`));
      }

      const resolvedSrtPath = path.resolve(srtOutputPath);
      if (!fs.existsSync(resolvedSrtPath)) {
        return reject(new Error("SRT file not found after transcription."));
      }

      try {
        const segments = parseSRT(resolvedSrtPath);
        resolve(segments);
      } catch (err) {
        if (err instanceof Error) {
          reject(new Error(`Failed to parse SRT: ${err.message}`));
        } else {
          reject(new Error("Failed to parse SRT: Unknown error"));
        }
      }
    });
  });
}
