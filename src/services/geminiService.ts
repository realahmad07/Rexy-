import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ExploitStep {
  step: number;
  actor: 'User' | 'Attacker' | 'Vault' | 'Contract';
  action: string;
  outcome: string;
  lineRange: string;
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
  location: string;
  remediation: string;
  attackVector: string;
  exploitPoC: string;
  owaspCategory: string;
  swcId: string;
  historicalContext?: string;
  historicalExploitName?: string; // New: Specific real-world example
  simulationSteps: ExploitStep[];
}

export interface DependencyNode {
  id: string;
  type: 'Contract' | 'Library' | 'Interface' | 'External';
  risk: 'High' | 'Medium' | 'Low' | 'Secure';
}

export interface DependencyLink {
  source: string;
  target: string;
  relation: 'Inherits' | 'Calls' | 'Uses';
}

export interface FuzzingScenario {
  name: string;
  description: string;
  attackInput: string;
  outcome: 'Success' | 'Fail';
  gasUsed: number;
  vulnerabilityTargeted: string;
}

export interface ThreatMetric {
  timestamp: string;
  event: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface ContractFile {
  name: string;
  content: string;
}

export interface ContractAudit {
  contractName: string;
  riskScore: number;
  vulnerabilities: SecurityVulnerability[];
  architectureReview: string;
  gasOptimizationTips: string[];
  safeCodeSnippet: string;
  dependencyGraph: {
    nodes: DependencyNode[];
    links: DependencyLink[];
  };
  fuzzingSimulation: FuzzingScenario[];
  threatMonitoringData: ThreatMetric[];
}

async function fetchWithRetry<T>(fn: () => Promise<T>, maxRetries = 3, initialDelay = 1000): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const isQuotaError = error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED' || error?.code === 429;
      
      if (isQuotaError && i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        console.warn(`Gemini API Quota Exceeded. Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export async function auditSmartContract(files: ContractFile | string): Promise<ContractAudit | null> {
  const codeContent = typeof files === 'string' ? files : files.content;
  
  const prompt = `You are Rexy, an elite Smart Contract Security Architect. Execute a MISSION-CRITICAL audit of this Solidity code:
  
  "${codeContent}"
  
  TASK 1: VULNERABILITY MAPPING & HISTORICAL GROUNDING
  Identify logical flaws. Map them to real-world historical exploits (e.g., "The DAO Hack", "Poly Network", "Ronin Bridge").
  
  TASK 2: DEPENDENCY MAPPING
  Identify contract relationships, inheritance, and external calls for a dependency graph.
  
  TASK 3: DYNAMIC FUZZING SIMULATION
  Create 3-5 fuzzing scenarios where random inputs are used to attempt to break the contract logic.
  
  TASK 4: THREAT MONITORING DATA
  Generate 5-10 baseline monitoring events that would help detect post-deployment anomalies.
  
  TASK 5: ABSOLUTE HARDENING
  Generate a 'safeCodeSnippet' that is a COMPREHENSIVE REPLACEMENT for the original file.`;

  try {
    const response = await fetchWithRetry(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are Rexy, a super-intelligent AI security auditor. You provide high-precision security audits, including dependency graphs, fuzzing simulations, and historical hack references. Your 'safeCodeSnippet' MUST be the full, complete contract with all vulnerabilities resolved.",
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
                  historicalExploitName: { type: Type.STRING },
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
            safeCodeSnippet: { type: Type.STRING },
            dependencyGraph: {
              type: Type.OBJECT,
              properties: {
                nodes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      type: { type: Type.STRING, enum: ['Contract', 'Library', 'Interface', 'External'] },
                      risk: { type: Type.STRING, enum: ['High', 'Medium', 'Low', 'Secure'] }
                    },
                    required: ["id", "type", "risk"]
                  }
                },
                links: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      source: { type: Type.STRING },
                      target: { type: Type.STRING },
                      relation: { type: Type.STRING, enum: ['Inherits', 'Calls', 'Uses'] }
                    },
                    required: ["source", "target", "relation"]
                  }
                }
              },
              required: ["nodes", "links"]
            },
            fuzzingSimulation: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  attackInput: { type: Type.STRING },
                  outcome: { type: Type.STRING, enum: ['Success', 'Fail'] },
                  gasUsed: { type: Type.NUMBER },
                  vulnerabilityTargeted: { type: Type.STRING }
                },
                required: ["name", "description", "attackInput", "outcome", "gasUsed", "vulnerabilityTargeted"]
              }
            },
            threatMonitoringData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timestamp: { type: Type.STRING },
                  event: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] }
                },
                required: ["timestamp", "event", "severity"]
              }
            }
          },
          required: ["contractName", "riskScore", "vulnerabilities", "architectureReview", "gasOptimizationTips", "safeCodeSnippet", "dependencyGraph", "fuzzingSimulation", "threatMonitoringData"]
        }
      }
    }));

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error: any) {
    if (error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED') {
      console.error("Gemini Quota Exhausted: Please check your Google Cloud billing or wait a few minutes.");
    } else {
      console.error("Error auditing contract:", error);
    }
    return null;
  }
}

export async function chatWithRexy(message: string, context: { code: string; audit: ContractAudit | null }, history: { role: 'user' | 'model'; parts: { text: string }[] }[]) {
  const result = await fetchWithRetry(() => {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `You are Rexy, the AI Smart Contract Security Partner. You are helpful, technical, and alert.
        Context:
        Current Code: ${context.code}
        Current Audit Status: ${context.audit ? JSON.stringify({ risk: context.audit.riskScore, vulcanCount: context.audit.vulnerabilities.length }) : "Not Audited"}
        
        Always provide technical answers. If the user asks for a fix, guide them or explain why a fix was made in Rexy's patches.`,
      },
      history: history as any,
    });
    return chat.sendMessage({ message });
  });

  return result.text;
}
