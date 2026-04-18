import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface SecurityVulnerability {
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  location: string; // e.g. "function withdraw()"
  remediation: string;
  attackVector: string; // Detailed explanation of how the attack works
  exploitPoC: string; // A Solidity or JS snippet showing the exploit
  owaspCategory: string; // e.g. "SC01: Reentrancy"
  swcId: string; // e.g. "SWC-107"
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
  const prompt = `You are Rexy, an elite Smart Contract Security Auditor specializing in OWASP standards. Perform a deep semantic audit on the following Solidity code:
  
  "${solidityCode}"
  
  For each vulnerability found, you must provide:
  1. How the code is attacked (Attack Vector).
  2. A Proof of Concept (PoC) exploit snippet.
  3. The official OWASP Smart Contract Top 10 Category (e.g., SC01: Reentrancy).
  4. The specific SWC ID (Smart Contract Weakness Classification) (e.g., SWC-107).
  5. A hardened remediation and a complete safe code snippet.
  
  Return a structured JSON report.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are Rexy, an AI security auditor following the OWASP Smart Contract Security Testing Guide. You provide high-precision security audits. You identify specific line logic errors, explain attack vectors, generate exploit PoCs, and cross-reference findings with OWASP SC Top 10 Categories and SWC IDs to ensure professional auditing standards.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            contractName: { type: Type.STRING },
            riskScore: { type: Type.NUMBER },
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
                  attackVector: { type: Type.STRING },
                  exploitPoC: { type: Type.STRING },
                  owaspCategory: { type: Type.STRING, description: "Mapping to OWASP Smart Contract Top 10" },
                  swcId: { type: Type.STRING, description: "Mapping to SWC Weakness Classification" },
                  historicalContext: { type: Type.STRING }
                },
                required: ["severity", "title", "description", "location", "remediation", "attackVector", "exploitPoC", "owaspCategory", "swcId"]
              }
            },
            architectureReview: { type: Type.STRING },
            gasOptimizationTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            safeCodeSnippet: { type: Type.STRING }
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
