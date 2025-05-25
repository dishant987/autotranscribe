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
  const prompt = `You are an AI assistant that generates multiple-choice questions in **valid JSON** format only.

INSTRUCTIONS:
- Generate EXACTLY 3 multiple-choice questions based on the lecture segment.
- Each question object must follow this exact format:
  {
    "question": "string",
    "options": ["A) ...", "B) ...", "C) ..."],
    "correctAnswer": "B) ..."
  }
- "options" must be an array of exactly 3 strings.
- Do NOT include explanations, markdown, or extra text.
- Do NOT include trailing commas.
- Output must be a **valid JSON array** ONLY.

LECTURE SEGMENT:
"""${text}"""
`;

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
