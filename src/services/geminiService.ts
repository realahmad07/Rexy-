import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface SecurityVulnerability {
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  location: string; // e.g. "function withdraw()"
  remediation: string;
  historicalContext?: string; // Reference to a real hack
}

export interface ContractAudit {
  contractName: string;
  riskScore: number; // 0-100 (100 is most dangerous)
  vulnerabilities: SecurityVulnerability[];
  architectureReview: string;
  gasOptimizationTips: string[];
  safeCodeSnippet: string; // A hardened version of detected weak logic
}

export async function auditSmartContract(solidityCode: string): Promise<ContractAudit | null> {
  const prompt = `You are a Tier-1 Smart Contract Security Researcher. Perform a deep semantic audit on the following Solidity code:
  
  "${solidityCode}"
  
  Focus on:
  1. Re-entrancy vulnerabilities.
  2. Access control flaws (e.g. onlyOwner, centraliation risks).
  3. Logic errors in state updates.
  4. Integer overflows/underflows (if pre 0.8.0).
  5. Front-running and MEV risks.
  
  Return a structured JSON audit report.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are Sentinel3, an AI security auditor. You provide high-precision security audits for Web3 smart contracts. Your reports are used by developers to prevent critical exploits. You must be thorough, identify specific line logic errors, and provide actionable remediation.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            contractName: { type: Type.STRING },
            riskScore: { type: Type.NUMBER, description: "Risk index from 0 to 100" },
            vulnerabilities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  severity: { type: Type.STRING, enum: ['Critical', 'High', 'Medium', 'Low'] },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  location: { type: Type.STRING },
                  remediation: { type: Type.STRING },
                  historicalContext: { type: Type.STRING }
                },
                required: ["severity", "title", "description", "location", "remediation"]
              }
            },
            architectureReview: { type: Type.STRING },
            gasOptimizationTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            safeCodeSnippet: { type: Type.STRING, description: "Hardened Solidity code snippet fixing the major issue." }
          },
          required: ["contractName", "riskScore", "vulnerabilities", "architectureReview", "gasOptimizationTips", "safeCodeSnippet"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Error auditing contract:", error);
    return null;
  }
}
