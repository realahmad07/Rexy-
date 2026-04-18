import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ExploitStep {
  step: number;
  actor: 'User' | 'Attacker' | 'Vault' | 'Contract';
  action: string;
  outcome: string;
  lineRange: string; // e.g. "12-15"
  balanceChange?: {
    entity: string;
    amount: string;
    direction: 'up' | 'down';
  };
}

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
  simulationSteps: ExploitStep[]; // The sequence for the Shadow-Run Engine
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
  
  For each vulnerability found, you MUST provide a detailed "Shadow-Run" simulation. This is a sequence of 3-7 steps showing exactly how the attack is executed at the logic level.
  
  Each step must include:
  - Actor: (User, Attacker, Contract)
  - Action: (e.g., "Calls withdraw()")
  - Outcome: (e.g., "State is not updated before transfer")
  - LineRange: The lines in the provided code where this happens.
  - BalanceChange: Numeric effect on the involved entities.
  
  Return a structured JSON report mapping to the OWASP Smart Contract Top 10 and SWC IDs.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are Rexy, an AI security auditor following the OWASP Smart Contract Security Testing Guide. You provide high-precision security audits. You identify specific line logic errors, explain attack vectors, generate exploit PoCs, and cross-reference findings with OWASP SC Top 10 Categories and SWC IDs. You MUST generate 'simulationSteps' for every vulnerability found.",
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
                  owaspCategory: { type: Type.STRING },
                  swcId: { type: Type.STRING },
                  historicalContext: { type: Type.STRING },
                  simulationSteps: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        step: { type: Type.NUMBER },
                        actor: { type: Type.STRING, enum: ['User', 'Attacker', 'Vault', 'Contract'] },
                        action: { type: Type.STRING },
                        outcome: { type: Type.STRING },
                        lineRange: { type: Type.STRING },
                        balanceChange: {
                          type: Type.OBJECT,
                          properties: {
                            entity: { type: Type.STRING },
                            amount: { type: Type.STRING },
                            direction: { type: Type.STRING, enum: ['up', 'down'] }
                          },
                          required: ["entity", "amount", "direction"]
                        }
                      },
                      required: ["step", "actor", "action", "outcome", "lineRange"]
                    }
                  }
                },
                required: ["severity", "title", "description", "location", "remediation", "attackVector", "exploitPoC", "owaspCategory", "swcId", "simulationSteps"]
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
