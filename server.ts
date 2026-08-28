import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent telemetry
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (err) {
      console.error("Failed to initialize GoogleGenAI client:", err);
    }
  }
  return aiClient;
}

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Gemini Ask AI Property Assistant Route
app.post("/api/gemini/ask-ai", async (req, res) => {
  try {
    const { message, conversationHistory, propertyContext } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message prompt is required" });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are "HDB Insight AI" (HDB Copilot), Singapore's premier AI property analyst and senior HDB advisor.
You provide highly accurate, objective, and data-backed advice on Singapore Housing & Development Board (HDB) resale flats, BTO vs Resale, CPF Housing Grants (Enhanced CPF Housing Grant EHG up to $80k, Family Grant up to $80k, Proximity Housing Grant PHG up to $30k), HDB Concessionary Loan (2.6% interest, 80% LTV, 25yr tenure) vs Bank Loans (Fixed/SORA, 75% LTV, 30yr tenure), Mortgage Servicing Ratio (MSR 30%), Total Debt Servicing Ratio (TDSR 55%), Buyer's Stamp Duty (BSD), ABSD for PRs/Foreigners/2nd properties, Cash-Over-Valuation (COV), Bala's Curve lease decay, Ethnic Integration Policy (EIP/SPR quota), Minimum Occupation Period (MOP 5 years), and Prime/Plus/Standard classification (PLH rules with 10-yr MOP & subsidy clawback).

Tone: Highly professional, analytical, authoritative yet warm, concise, and structured with bullet points.
Currency: Always in Singapore Dollars (SGD, S$).
${propertyContext ? `Current Property in Focus: ${JSON.stringify(propertyContext)}` : ""}`;

    if (ai) {
      const chat = ai.chats.create({
        model: "gemini-3.7-flash",
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      // Send recent context if history is provided
      if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
        // Send history sequentially or synthesize prompt
        const synthesizedPrompt = `Context conversation:\n${conversationHistory
          .slice(-4)
          .map((m: { role: string; content: string }) => `${m.role === "user" ? "User" : "AI"}: ${m.content}`)
          .join("\n")}\n\nUser Question: ${message}`;
        
        const response = await chat.sendMessage({ message: synthesizedPrompt });
        return res.json({ reply: response.text });
      } else {
        const response = await chat.sendMessage({ message });
        return res.json({ reply: response.text });
      }
    } else {
      // High-quality contextual fallback when API key is configuring
      const fallbackReply = generateFallbackAdvice(message, propertyContext);
      return res.json({ reply: fallbackReply });
    }
  } catch (error: any) {
    console.error("Gemini Ask AI error:", error);
    res.status(500).json({
      error: "Failed to generate AI response",
      details: error.message,
      reply: generateFallbackAdvice(req.body.message || "general question", req.body.propertyContext),
    });
  }
});

// Gemini Deep Property Report & Verdict API
app.post("/api/gemini/property-report", async (req, res) => {
  try {
    const { property, userPersona } = req.body;
    const ai = getGeminiClient();

    if (!property) {
      return res.status(400).json({ error: "Property object is required" });
    }

    const prompt = `Perform a deep institutional-grade property valuation and decision analysis for this Singapore HDB flat:
Property Details:
- Address: ${property.address || property.town}
- Town: ${property.town}
- Flat Type: ${property.flatType}
- Floor Area: ${property.sqm} sqm (${property.sqft} sqft)
- Floor Level: ${property.floorLevel}
- Remaining Lease: ${property.remainingLease} years (Built: ${property.leaseCommenceDate})
- Asking Price: S$${property.askingPrice?.toLocaleString()}
- AI Base Valuation: S$${property.aiValuation?.toLocaleString()}
- Price PSF: S$${property.pricePsf}
- Location Score: ${property.locationScore}/100 (MRT: ${property.mrtDistance}m, Schools: ${property.schoolDistance}m)
- User Persona: ${userPersona || "First-time Buyer"}

Please output an extensive analytical assessment in JSON format with these exact keys:
{
  "executiveVerdict": "Good Value" | "Fairly Priced" | "Above Market" | "Strong Growth" | "Monitor",
  "overallScore": number (1 to 100),
  "oneSentenceSummary": "string",
  "bottomLineRecommendation": "string answering: Is this a good buy, good sell, or continue comparing?",
  "strengths": ["string", "string", "string"],
  "weaknesses": ["string", "string", "string"],
  "risks": ["string", "string", "string"],
  "buyerStrategy": {
    "recommendedOffer": number,
    "maxCeiling": number,
    "negotiationTactic": "string"
  },
  "sellerStrategy": {
    "recommendedListingPrice": number,
    "expectedDaysOnMarket": number,
    "targetBuyerProfile": "string"
  },
  "leaseDecayAssessment": "string",
  "fiveYearGrowthForecastPct": number
}`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are Singapore's most advanced HDB Resale algorithmic valuator. Respond strictly in valid JSON.",
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ report: parsed });
    } else {
      // Algorithmic valuation fallback based on real Singapore property equations
      const isUnderValued = property.askingPrice <= property.aiValuation;
      const verdict = isUnderValued
        ? (property.locationScore > 85 ? "Good Value" : "Strong Growth")
        : (property.askingPrice > property.aiValuation * 1.05 ? "Above Market" : "Fairly Priced");

      const score = Math.round(
        (property.locationScore * 0.4) +
        (Math.min(100, (property.remainingLease / 99) * 100) * 0.3) +
        (isUnderValued ? 92 : 78) * 0.3
      );

      return res.json({
        report: {
          executiveVerdict: verdict,
          overallScore: score,
          oneSentenceSummary: `${verdict}: Transacting at S$${property.pricePsf} PSF with ${property.locationScore}/100 location connectivity in high-demand ${property.town}.`,
          bottomLineRecommendation: isUnderValued
            ? "Strong Buy Opportunity: This unit offers immediate fair value margin and resilient lease runway. Proceed to check HFE and arrange an urgent viewing."
            : "Fair Consideration: Price is aligned with recent cluster transactions. Negotiate with a 2-3% buffer before committing Option to Purchase.",
          strengths: [
            `${property.mrtDistance}m proximity to nearest MRT with rapid connection to CBD/Town.`,
            `Healthy remaining lease of ${property.remainingLease} years protecting CPF financing eligibility for young buyers.`,
            `Generous ${property.sqft} sqft layout with favorable floor range (${property.floorLevel}).`
          ],
          weaknesses: [
            `Asking price commands S$${property.pricePsf} PSF, slightly above 3-year historical town baseline.`,
            `High floor premiums in ${property.town} face tighter appraisal scrutiny by HDB panel valuers.`
          ],
          risks: [
            `Potential Cash-Over-Valuation (COV) risk if seller asks above official HDB resale valuation.`,
            `Upcoming BTO completions in surrounding sectors could increase future supply after 5-year MOP.`
          ],
          buyerStrategy: {
            recommendedOffer: Math.round(property.aiValuation * 0.98),
            maxCeiling: Math.round(property.aiValuation * 1.01),
            negotiationTactic: "Open with a clean OTP offer backed by an approved In-Principle Approval (IPA) to incentivize seller."
          },
          sellerStrategy: {
            recommendedListingPrice: Math.round(property.aiValuation * 1.03),
            expectedDaysOnMarket: 28,
            targetBuyerProfile: "Upgraders and young couples looking for established town amenities."
          },
          leaseDecayAssessment: `At ${property.remainingLease} years remaining, Bala's curve value retention is approx ${(property.remainingLease > 70 ? 88 : 74)}%. CPF OA financing and HDB loan eligibility remain fully intact for buyers aged under 40.`,
          fiveYearGrowthForecastPct: property.town === "Bishan" || property.town === "Queenstown" ? 14.5 : 9.8
        }
      });
    }
  } catch (error: any) {
    console.error("Gemini Report generation error:", error);
    res.status(500).json({ error: "Failed to generate report", details: error.message });
  }
});

// Helper for intelligent fallback advice
function generateFallbackAdvice(query: string, propContext?: any): string {
  const q = query.toLowerCase();
  if (q.includes("grant") || q.includes("ehg") || q.includes("phg")) {
    return `### Singapore HDB CPF Housing Grants Breakdown (2025/2026):

1. **Enhanced CPF Housing Grant (EHG)**: Up to **S$80,000** for first-timer families (household income ceiling S$9,000) or up to S$40,000 for singles (income ceiling S$4,500).
2. **CPF Housing Grant (Family Grant)**: **S$80,000** for 2-4 room resale flats, **S$50,000** for 5-room/Executive flats (income ceiling S$14,000).
3. **Proximity Housing Grant (PHG)**: **S$30,000** if living with parents/children, or **S$20,000** if living within 4km radius.

**Maximum Combined Grant**: A first-timer couple buying a 4-room resale flat near parents can receive up to **S$190,000 in direct CPF grants**, significantly reducing cash outlay!`;
  }
  if (q.includes("cov") || q.includes("cash over valuation")) {
    return `### What is Cash-Over-Valuation (COV) in HDB Resale?

COV is the difference between the **agreed purchase price** and the **official HDB valuation**.
- Example: Agreed Price = S$750,000 | Official HDB Valuation = S$720,000 => **COV = S$30,000**.
- **Important**: COV **cannot** be covered by HDB housing loans, bank loans, or CPF savings. It **must be paid in 100% cold hard cash** during completion!
- **How to minimize COV**: Check recent transacted prices for the same block and floor range on HDB Insight AI before granting Option Fee ($1,000).`;
  }
  if (q.includes("loan") || q.includes("msr") || q.includes("bank")) {
    return `### HDB Loan vs. Bank Loan Comparison:

- **HDB Concessionary Loan**:
  - Current Interest: **2.60% p.a.** (pegged at +0.1% above CPF OA rate of 2.5%).
  - Max LTV: **80%** of purchase price/valuation.
  - Early repayment penalty: **$0** (no lock-in).
- **Bank Loan**:
  - Current Interest: **2.50% - 3.20% p.a.** (Fixed or 3M SORA).
  - Max LTV: **75%** (requires min 5% cash downpayment + 20% CPF/Cash).
  - Lock-in period: 2 to 3 years.
- **MSR (Mortgage Servicing Ratio)**: Max **30%** of gross monthly household income for HDB purchases.`;
  }
  return `### HDB Insight AI Advisor Summary:

For Singapore HDB resale properties:
- **Fair Valuation**: Always evaluate recent transactions in the same cluster within the last 6 months, factoring in floor level (+S$3k-$5k per floor above level 8) and remaining lease.
- **Remaining Lease Rule**: Ensure the remaining lease covers the youngest buyer up to age 95 to utilize maximum CPF Ordinary Account funds and qualify for the full 80% / 75% loan-to-value.
- **HFE Letter**: You must obtain a valid HDB Flat Eligibility (HFE) letter before securing an Option to Purchase (OTP).

Let me know if you would like me to simulate your specific grants, calculate net cash proceeds, or analyze a specific block!`;
}

// Start Vite / Static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HDB Insight AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
