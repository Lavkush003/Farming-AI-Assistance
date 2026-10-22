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

// ========================================================
// 💧 AI Evapotranspiration (ET₀) & Smart Irrigation Scheduler
// ========================================================
router.post("/smart-irrigation", async (req, res) => {
    try {
        const { crop, stage, acres, soilType, irrigationMethod, region, weather } = req.body;

        if (!crop || !acres) {
            return res.status(400).json({ error: "Crop and acres are required." });
        }

        // FAO-56 Crop coefficient estimates
        const kcTable = {
            "Wheat": { Initial: 0.35, Vegetative: 0.75, "Flowering / Mid-Season": 1.15, Maturity: 0.45 },
            "Rice (Paddy)": { Initial: 1.05, Vegetative: 1.15, "Flowering / Mid-Season": 1.25, Maturity: 0.95 },
            "Cotton": { Initial: 0.40, Vegetative: 0.75, "Flowering / Mid-Season": 1.15, Maturity: 0.65 },
            "Tomato": { Initial: 0.50, Vegetative: 0.80, "Flowering / Mid-Season": 1.15, Maturity: 0.80 },
            "Potato": { Initial: 0.45, Vegetative: 0.75, "Flowering / Mid-Season": 1.15, Maturity: 0.75 },
            "Maize": { Initial: 0.40, Vegetative: 0.80, "Flowering / Mid-Season": 1.15, Maturity: 0.60 },
            "Sugarcane": { Initial: 0.40, Vegetative: 1.00, "Flowering / Mid-Season": 1.25, Maturity: 0.75 },
            "Mustard": { Initial: 0.35, Vegetative: 0.70, "Flowering / Mid-Season": 1.05, Maturity: 0.35 },
            "Soybean": { Initial: 0.40, Vegetative: 0.75, "Flowering / Mid-Season": 1.10, Maturity: 0.50 },
            "Onion": { Initial: 0.45, Vegetative: 0.70, "Flowering / Mid-Season": 1.05, Maturity: 0.75 },
        };

        const cropKc = (kcTable[crop] && kcTable[crop][stage]) || 0.85;
        const et0 = weather?.et0 || 4.2; // mm/day default
        const etc = Number((et0 * cropKc).toFixed(2)); // Crop water requirement in mm/day

        // Irrigation efficiency
        const efficiencyMap = {
            "Drip Irrigation": 0.90,
            "Sprinkler Irrigation": 0.75,
            "Flood / Furrow Irrigation": 0.55,
        };
        const efficiency = efficiencyMap[irrigationMethod] || 0.75;

        // 1 mm water on 1 acre = 4,046.86 Liters
        const grossWaterPerAcre = Math.round((etc * 4047) / efficiency);
        const totalLiters = Math.round(grossWaterPerAcre * Number(acres));

        // 5 HP agricultural pump typically delivers ~40,000 Liters/Hour
        const pumpHours = Number((totalLiters / 40000).toFixed(1));

        let aiAdvisory = "";
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            const prompt = `You are an expert precision irrigation agronomist in India.
Field Details:
- Crop: ${crop} (Growth Stage: ${stage || "Active Vegetative"})
- Farm Size: ${acres} acres
- Soil Type: ${soilType || "Alluvial Loam"}
- Irrigation Method: ${irrigationMethod || "Drip"}
- Region: ${region || "India"}
- Calculated ETc: ${etc} mm/day (Reference ET0: ${et0} mm/day, Kc: ${cropKc})
- Total Water Need: ${totalLiters.toLocaleString()} Liters/day (~${pumpHours} pump hours)
- Weather Context: Temperature: ${weather?.temp || 30}°C, Humidity: ${weather?.humidity || 60}%, Rain Forecast: ${weather?.rain || 0}mm

Provide a concise, practical 3-step irrigation schedule for this farmer:
1. ⏰ Recommended Watering Window (e.g. Early morning vs evening to avoid evaporation)
2. 💧 Soil Moisture & Disease Prevention Advice (e.g., avoiding waterlogging to prevent root rot / damping off)
3. 🌦️ Rain Adjustment Rule (when to delay or reduce pump runtime)
Keep it bulleted, farmer-friendly, and very clear.`;

            const candidateModels = ["gemini-3.1-flash-lite", "gemini-flash-lite-latest", "gemini-3.5-flash-lite", "gemini-3.6-flash"];
            for (const modelName of candidateModels) {
                try {
                    const response = await ai.models.generateContent({
                        model: modelName,
                        contents: prompt,
                        config: { temperature: 0.7 }
                    });
                    if (response && response.text) {
                        aiAdvisory = response.text;
                        break;
                    }
                } catch (e) {
                    // try next model
                }
            }
        } catch (aiErr) {
            console.warn("AI irrigation advisory note:", aiErr.message);
        }

        if (!aiAdvisory) {
            aiAdvisory = `• ⏰ Optimal Schedule: Irrigate early in the morning (6:00 AM – 8:30 AM) when wind and evapotranspiration are lowest.
• 💧 Moisture Tip: For ${soilType || "your soil"}, split watering into 2 intervals if using ${irrigationMethod || "drip"} to encourage deep root penetration and prevent collar rot.
• 🌦️ Weather Rule: If rainfall exceeds 8 mm in your area, withhold irrigation for 48 hours to conserve water and prevent nutrient leaching.`;
        }

        return res.json({
            success: true,
            crop,
            stage,
            acres,
            et0,
            kc: cropKc,
            etc,
            grossWaterPerAcre,
            totalLiters,
            pumpHours,
            efficiencyPercent: Math.round(efficiency * 100),
            aiAdvisory
        });

    } catch (error) {
        console.error("Smart irrigation error:", error);
        return res.status(500).json({ error: "Failed to calculate irrigation schedule", details: error.message });
    }
});

// ========================================================
// 🐛 Predictive Pest & Insect Outbreak Early Warning
// ========================================================
router.post("/pest-forecast", async (req, res) => {
    try {
        const { crop, pest, region, weather } = req.body;

        if (!crop || !pest) {
            return res.status(400).json({ error: "Crop and pest are required." });
        }

        // Biological base temperatures and threshold GDD for pest life-cycle stages
        const pestData = {
            "Fall Armyworm": { baseTemp: 10.0, optimalTemp: 28, maxTemp: 35, gddEggHatch: 45, gddLarvae: 180, commonCrops: ["Maize", "Rice", "Sugarcane"] },
            "Pink Bollworm": { baseTemp: 12.0, optimalTemp: 30, maxTemp: 38, gddEggHatch: 55, gddLarvae: 210, commonCrops: ["Cotton"] },
            "Aphids": { baseTemp: 8.0, optimalTemp: 24, maxTemp: 32, gddEggHatch: 35, gddLarvae: 120, commonCrops: ["Mustard", "Wheat", "Tomato"] },
            "Whitefly": { baseTemp: 11.0, optimalTemp: 30, maxTemp: 37, gddEggHatch: 40, gddLarvae: 150, commonCrops: ["Cotton", "Tomato", "Soybean"] },
            "Yellow Stem Borer": { baseTemp: 10.5, optimalTemp: 29, maxTemp: 35, gddEggHatch: 50, gddLarvae: 220, commonCrops: ["Rice"] },
        };

        const targetPest = pestData[pest] || { baseTemp: 10.0, optimalTemp: 28, gddEggHatch: 50 };
        const tempMax = weather?.tempMax || 32;
        const tempMin = weather?.tempMin || 22;
        const avgTemp = (tempMax + tempMin) / 2;
        const humidity = weather?.humidity || 65;

        // Daily Growing Degree Day (GDD)
        const dailyGdd = Math.max(0, Number((avgTemp - targetPest.baseTemp).toFixed(1)));
        
        // 7-day cumulative projection
        const projected7DayGdd = Math.round(dailyGdd * 7);

        // Calculate risk status based on temperature suitability & humidity
        let riskLevel = "Moderate";
        let riskScore = 55; // 0-100
        let alertMessage = "";

        if (avgTemp < targetPest.baseTemp) {
            riskLevel = "Low";
            riskScore = 20;
            alertMessage = "Cooler temperatures inhibit insect development. Minimal threat.";
        } else if (dailyGdd >= 12 && humidity >= 65) {
            riskLevel = "High";
            riskScore = 85;
            alertMessage = "High Heat Unit Accumulation & Humidity! Rapid egg hatching and larval activity expected within 48–72 hours.";
        } else if (dailyGdd >= 15 && humidity >= 75) {
            riskLevel = "Severe Outbreak";
            riskScore = 95;
            alertMessage = "CRITICAL ALERT: Optimal thermal and moisture conditions for pest epidemic. Immediate scouting and preventative bio-measures required.";
        } else {
            riskLevel = "Moderate";
            riskScore = 50;
            alertMessage = "Moderate pest progression. Routine field scouting recommended.";
        }

        let aiAdvisory = "";
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            const prompt = `You are a Senior Agricultural Entomologist specializing in Indian crop protection.
Pest Forecast Alert:
- Target Crop: ${crop}
- Insect Pest: ${pest}
- Region: ${region || "India"}
- Base Temperature Threshold: ${targetPest.baseTemp}°C
- Current Daily GDD: ${dailyGdd}°C-days (7-day projected: ${projected7DayGdd}°C-days)
- Weather Context: Max Temp: ${tempMax}°C, Min Temp: ${tempMin}°C, Humidity: ${humidity}%
- Current Assessed Risk Level: ${riskLevel} (${riskScore}/100)

Provide a practical, farmer-friendly Integrated Pest Management (IPM) plan:
1. 🔍 Scouting Directive (Exact plant parts to inspect: e.g. underside of top leaves, whorls, or flower buds)
2. 🌿 Preventative / Bio-Control Measure (e.g. 5% Neem Seed Kernel Extract, Pheromone traps count/acre, or Trichogramma parasitoids)
3. ⚠️ Economic Threshold & Rescue Spray (Safe approved formulation and dosage if infestation exceeds threshold)
Keep it clear, concise, and easy for Indian farmers to follow.`;

            const candidateModels = ["gemini-3.1-flash-lite", "gemini-flash-lite-latest", "gemini-3.5-flash-lite", "gemini-3.6-flash"];
            for (const modelName of candidateModels) {
                try {
                    const response = await ai.models.generateContent({
                        model: modelName,
                        contents: prompt,
                        config: { temperature: 0.7 }
                    });
                    if (response && response.text) {
                        aiAdvisory = response.text;
                        break;
                    }
                } catch (e) {
                    // try next model
                }
            }
        } catch (aiErr) {
            console.warn("AI pest forecast advisory note:", aiErr.message);
        }

        if (!aiAdvisory) {
            aiAdvisory = `• 🔍 Field Scouting: Inspect 20 random plants across field diagonals. Check the underside of young leaves and central shoots for egg clusters or early instar larvae.
• 🌿 Bio-Control Action: Install 4–5 Pheromone Traps per acre to monitor adult moth flight. Spray 5% Neem Seed Kernel Extract (NSKE) or Azadirachtin 10,000 ppm (2 ml/liter) as an ovicidal deterrent.
• ⚠️ Action Threshold: If 1–2 larvae per plant are observed or pheromone catch exceeds 8 moths/trap/night for 3 consecutive days, apply recommended biological/safe contact insecticide in late evening.`;
        }

        return res.json({
            success: true,
            crop,
            pest,
            region,
            dailyGdd,
            projected7DayGdd,
            baseTemp: targetPest.baseTemp,
            riskLevel,
            riskScore,
            alertMessage,
            aiAdvisory
        });

    } catch (error) {
        console.error("Pest forecast error:", error);
        return res.status(500).json({ error: "Failed to generate pest forecast", details: error.message });
    }
});

export default router;
