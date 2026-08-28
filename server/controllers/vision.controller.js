import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

export const detectDisease = async (req, res) => {
    try {
        const { image, mimeType, language = "English" } = req.body;

        if (!image || !mimeType) {
            return res.status(400).json({ error: "Image and mimeType are required" });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "Gemini API key is not configured" });
        }

        const ai = new GoogleGenAI({ apiKey: apiKey });

        const prompt = `You are an expert agricultural pathologist. Analyze this image of a crop/plant.
1. Identify the crop if possible.
2. Identify if there is any disease, pest, or nutrient deficiency.
3. Provide a short, actionable recommendation for treatment (organic preferred, chemical if necessary).
Please respond entirely in ${language}. Keep the response structured and easy to read for a farmer.`;

        // Strip the data:image/jpeg;base64, prefix if it exists
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: [
                prompt,
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: mimeType
                    }
                }
            ],
            config: {
                temperature: 0.4
            }
        });

        res.status(200).json({ result: response.text });
    } catch (error) {
        console.error("Vision AI error:", error);
        res.status(500).json({ error: "Failed to analyze crop image" });
    }
};
