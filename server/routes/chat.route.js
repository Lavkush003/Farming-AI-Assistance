// import express from "express";
// import { GoogleGenAI } from "@google/genai";

// const router = express.Router();

// router.post("/", async (req, res) => {
//     // Initialize SDK inside the route so dotenv has time to load
//     const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

//     try {
//         const { message } = req.body;

//         if (!message) {
//             return res.status(400).json({ error: "Message is required" });
//         }

//         const systemInstruction = `You are the FarmingHub Assistant, a helpful AI chatbot for a digital agriculture platform. 
// Your purpose is to help farmers grow crops, provide information on soil types, rainfall prediction, seasons, and platform navigation.
// Farmers can also add their crops on the product section and sell them. 
// If they ask about selling, buying, or account help, guide them step-by-step:
// - To sell: Go to Profile > Seller Panel, click 'Add New Product', fill details & upload image.
// - To buy: Browse 'Products', add to cart, and checkout.
// - To register: Click 'Login' in the navbar and select 'Register'.
// Keep responses concise, friendly, and use emojis where appropriate.`;

//         const response = await ai.models.generateContent({
//             model: "gemini-2.5-flash",
//             contents: message,
//             config: {
//                 systemInstruction: systemInstruction,
//                 temperature: 0.7
//             }
//         });

//         res.json({ text: response.text });
//     } catch (error) {
//         console.error("Gemini API Error:", error);
//         res.status(500).json({ error: "Failed to generate response. Please ensure your GEMINI_API_KEY is configured correctly." });
//     }
// });

// export default router;



import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

const systemInstruction = `
You are the FarmingHub Assistant, a helpful AI chatbot for a digital agriculture platform.

Your purpose is to help farmers with:
- Crop selection
- Soil types
- Rainfall
- Seasons
- Farming practices
- Platform navigation

Farmers can add crops in the Products section and sell them.

For platform-related questions:

To sell:
Go to Profile > Seller Panel > Add New Product > fill in the details > upload an image.

To buy:
Go to Products > select a product > add to cart > checkout.

To register:
Click Login in the navbar > Register.

Keep responses concise, friendly, useful, and use emojis where appropriate.
`;

router.post("/", async (req, res) => {
    try {
        // Check API key
        if (!process.env.GEMINI_API_KEY) {
            console.error("❌ GEMINI_API_KEY is missing");

            return res.status(500).json({
                error: "GEMINI_API_KEY is missing from server/.env"
            });
        }

        console.log("✅ Gemini API key is available");

        const { message } = req.body;

        // Check message
        if (!message || !message.trim()) {
            return res.status(400).json({
                error: "Message is required"
            });
        }

        console.log("📩 User message:", message);

        // Create Gemini client
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        // Model fallback list with active, high-quota models first
        const candidateModels = [
            "gemini-3.1-flash-lite",
            "gemini-flash-lite-latest",
            "gemini-3.5-flash-lite",
            "gemini-3.6-flash"
        ];
        let response = null;
        let lastError = null;

        for (const modelName of candidateModels) {
            try {
                response = await ai.models.generateContent({
                    model: modelName,
                    contents: message,
                    config: {
                        systemInstruction: systemInstruction,
                        temperature: 0.7
                    }
                });
                if (response && response.text) {
                    console.log(`✅ Gemini response received using model: ${modelName}`);
                    break;
                }
            } catch (modelErr) {
                lastError = modelErr;
                console.warn(`⚠️ Model ${modelName} encountered issue: ${modelErr.message}. Trying next candidate...`);
            }
        }

        if (!response || !response.text) {
            throw lastError || new Error("All Gemini model attempts returned empty response");
        }

        const text = response.text;
        console.log("🤖 Gemini:", text);

        return res.json({
            text: text
        });

    } catch (error) {
        console.error("====================================");
        console.error("❌ GEMINI API ERROR");
        console.error("====================================");

        console.error("Message:", error.message);
        console.error("Name:", error.name);
        console.error("Status:", error.status);
        console.error("Code:", error.code);

        if (error.response) {
            console.error("Response:", error.response);
        }

        console.error("Full error:", error);

        return res.status(500).json({
            error: "Gemini API request failed",
            details: error.message
        });
    }
});

// Yield Prediction endpoint
router.post("/yield-predict", async (req, res) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "GEMINI_API_KEY is missing" });
        }

        const { crop, acres, region, soilType } = req.body;

        if (!crop || !acres || !region) {
            return res.status(400).json({ error: "Crop, acres, and region are required" });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const prompt = `You are an expert Indian agricultural advisor. A farmer has the following details:
- Crop: ${crop}
- Farm Size: ${acres} acres
- Region/State: ${region}
- Soil Type: ${soilType || "Not specified"}

Please provide:
1. **Expected Yield**: Estimate the total yield in quintals (100 kg) for this crop on ${acres} acres in ${region}.
2. **Current Market Price**: Estimate the current MSP or average mandi price per quintal for ${crop} in India (in ₹).
3. **Projected Revenue**: Multiply yield × price to give the farmer an estimated total revenue.
4. **Key Tips**: Give 2-3 specific tips to maximize yield for this crop in this region.
5. **Risk Factors**: Mention 1-2 risks (weather, pests) the farmer should watch for.

Format your response clearly with headers and bullet points. Use ₹ for currency.`;

        const candidateModels = [
            "gemini-3.1-flash-lite",
            "gemini-flash-lite-latest",
            "gemini-3.5-flash-lite",
            "gemini-3.6-flash"
        ];
        let response = null;
        let lastError = null;

        for (const modelName of candidateModels) {
            try {
                response = await ai.models.generateContent({
                    model: modelName,
                    contents: prompt,
                    config: { temperature: 0.7 }
                });
                if (response && response.text) {
                    break;
                }
            } catch (err) {
                lastError = err;
            }
        }

        if (!response || !response.text) {
            throw lastError || new Error("Yield prediction AI response was empty");
        }

        return res.json({ result: response.text });

    } catch (error) {
        console.error("Yield prediction error:", error);
        return res.status(500).json({ error: "Failed to predict yield", details: error.message });
    }
});

export default router;
