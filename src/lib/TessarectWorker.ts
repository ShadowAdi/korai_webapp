import { createWorker } from "tesseract.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const InitializeWorker = async (buffer: Buffer): Promise<string> => {
  try {
    console.log("Initializing Tesseract worker...");
    const worker = await createWorker("eng", 1, {
      logger: (m) => console.log("Tesseract log:", m),
    });
    const {
      data: { text },
    } = await worker.recognize(buffer);
    await worker.terminate();
    return text;
  } catch (error) {
    console.error("Error in InitializeWorker:", error);
    throw error;
  }
};
