import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const LLM_API_URL = process.env.LLM_API_URL;

if (!LLM_API_URL) {
  throw new Error("LLM_API_URL is not defined in environment variables");
}

interface LlmResponse {
  response: string;
}

export const generateMCQs = async (text: string): Promise<string> => {
  const prompt = `You are an assistant that generates multiple choice questions.

Based on the following lecture segment, generate exactly 3 multiple-choice questions. Return the result as a JSON array, where each object has the following format:

{
  "question": "string",
  "options": ["A) ...", "B) ...", "C) ..."],
  "correctAnswer": "B) ..."
}

Only respond with valid JSON.

Lecture segment:
"""${text}"""`;

  try {
    const { data } = await axios.post<LlmResponse>(LLM_API_URL, {
      model: "llama3",
      prompt,
      stream: false,
    });

    const resultText = data.response.trim();
    if (!resultText) {
      throw new Error("Received empty response from LLM API");
    }
    return resultText;
  } catch (error: any) {
    console.error(
      "Failed to generate MCQs from LLM API:",
      error?.message || error
    );
    throw new Error(`LLM API Error: ${error?.message || "Unknown error"}`);
  }
};
