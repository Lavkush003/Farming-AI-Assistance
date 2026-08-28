import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

export const getWeatherAdvisory = async (req, res) => {
    try {
        const { weatherData } = req.body;

        if (!weatherData) {
            return res.status(400).json({ error: "Weather data is required" });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "Gemini API key is not configured" });
        }

        const ai = new GoogleGenAI({ apiKey: apiKey });

        const prompt = `You are an expert agricultural advisor. Based on the following current weather conditions and short-term forecast for a farming region, provide a very concise, 2-sentence actionable piece of advice for farmers (e.g., whether to water, spray pesticides, harvest, or protect crops). Keep it direct and easy to understand.\n\nWeather Data: ${JSON.stringify(weatherData)}`;

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
            config: {
                temperature: 0.7
            }
        });

        res.status(200).json({ advisory: response.text });
    } catch (error) {
        console.error("Weather advisory error:", error);
        res.status(500).json({ error: "Failed to generate weather advisory" });
    }
};
