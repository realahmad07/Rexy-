/**
 * RexAudit: AI-Powered Smart Contract Security Engine
 * 
 * Core service for interacting with the Gemini API to perform
 * deep-scan security audits on blockchain source code.
 * 
 * Includes logic for:
 * - Controlled prompt orchestration
 * - Response schema validation
 * - Fallback simulation for offline/demo modes
 */

import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { ContractAudit, Severity } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const FAST_MODEL = "gemini-3.1-flash-lite-preview";

export interface ContractFile {
  name: string;
  content: string;
}

async function fetchWithRetry<T>(fn: () => Promise<T>, maxRetries = 5, initialDelay = 1000): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const isQuotaError = 
        error?.message?.toLowerCase().includes('429') || 
        error?.message?.toLowerCase().includes('quota') ||
        error?.status === 'RESOURCE_EXHAUSTED' || 
        error?.code === 429;
      
      if (isQuotaError && i < maxRetries - 1) {
        // Exponential backoff with jitter
        const delay = (initialDelay * Math.pow(2, i)) + (Math.random() * 1000);
        console.warn(`Gemini API Quota Exceeded. Retrying in ${Math.round(delay)}ms... (Attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export async function auditSmartContract(files: ContractFile[] | string): Promise<ContractAudit | null> {
  const codeContent = typeof files === 'string' ? files : files.map(f => `// File: ${f.name}\n${f.content}`).join('\n\n');
  const lineCount = codeContent.split('\n').length;
  const fileCount = typeof files === 'string' ? 1 : files.length;
  
  const prompt = `You are a Lead Smart Contract Security Architect. Perform an enterprise-grade audit on the following code:
  
  "${codeContent}"
  
  AUDIT REQUIREMENTS:
  1. Detect Language & Framework: Identify if this is Solidity (Hardhat/Foundry), Rust (Anchor), or JavaScript/TypeScript.
  2. Vulnerability Scanning: Find Reentrancy, Overflow/Underflow, Access Control, Unchecked calls, Hardcoded secrets, etc.
  3. Logic Flow: Map the simplified execution paths of the contract.
  4. Severity & Confidence: Assign Critical, High, Medium, Low severities. Assign a confidence score (0-100) for each finding.
  5. Security Score: Rate the overall contract from 0 (Compromised) to 100 (Secure).
  6. Final Verdict: Decide if it is "Safe to Deploy" or "Needs Fixes".
  7. Gas Analysis: Calculate a Gas Efficiency Score (0-100) and provide specific optimization suggestions.
  8. Heatmap Mapping: Map risk levels (high, medium, low) and scores (0-100) to critical lines for a visual heatmap.

  REQUIRED JSON STRUCTURE:
  {
    "name": "Project Name",
    "language": "e.g. Solidity",
    "framework": "e.g. Hardhat",
    "securityScore": 85,
    "riskLevel": "Low",
    "summary": "Plain English summary",
    "financialRiskSummary": "Money loss explanation",
    "logicRiskSummary": "Logic flaw explanation",
    "vulnerabilities": [
      {
        "title": "Issue Title",
        "severity": "Critical|High|Medium|Low",
        "confidence": 95,
        "fileName": "contract.sol",
        "lineNumbers": [10, 15],
        "description": "Simple explanation",
        "impact": "Exploit impact",
        "remediation": "How to fix",
        "exploitPoC": "Proof of concept code",
        "codeSnippet": "Vulnerable code block"
      }
    ],
    "logicFlow": [
      { "from": "User", "to": "Contract", "action": "deposit()", "isRisky": false, "description": "User sends funds" }
    ],
    "safeCodeSnippet": "Complete secure file content",
    "finalVerdict": "Safe to Deploy"|"Needs Fixes",
    "architectureReview": "Overall system design feedback"
  }

  Retain existing visualization data (dependencyGraph, fuzzingSimulation, threatMonitoringData) formatted correctly for current components. Ensure every node ID referenced in dependencyGraph.links is also present in dependencyGraph.nodes.`;

  try {
    const response = await fetchWithRetry(() => ai.models.generateContent({
      model: FAST_MODEL,
      contents: prompt,
      config: {
        systemInstruction: "You are the world's leading AI Smart Contract Auditor. Your tone is professional, technical, and precise. You always output valid, complete JSON.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            language: { type: Type.STRING },
            framework: { type: Type.STRING },
            securityScore: { type: Type.NUMBER },
            riskLevel: { type: Type.STRING },
            summary: { type: Type.STRING },
            financialRiskSummary: { type: Type.STRING },
            logicRiskSummary: { type: Type.STRING },
            vulnerabilities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  fileName: { type: Type.STRING },
                  lineNumbers: { type: Type.ARRAY, items: { type: Type.NUMBER } },
                  description: { type: Type.STRING },
                  impact: { type: Type.STRING },
                  remediation: { type: Type.STRING },
                  exploitPoC: { type: Type.STRING },
                  codeSnippet: { type: Type.STRING }
                }
              }
            },
            logicFlow: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  from: { type: Type.STRING },
                  to: { type: Type.STRING },
                  action: { type: Type.STRING },
                  isRisky: { type: Type.BOOLEAN },
                  description: { type: Type.STRING }
                }
              }
            },
            safeCodeSnippet: { type: Type.STRING },
            finalVerdict: { type: Type.STRING },
            architectureReview: { type: Type.STRING },
            dependencyGraph: {
              type: Type.OBJECT,
              properties: {
                nodes: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, type: { type: Type.STRING }, risk: { type: Type.STRING } } } },
                links: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { source: { type: Type.STRING }, target: { type: Type.STRING }, relation: { type: Type.STRING } } } }
              }
            },
            fuzzingSimulation: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  attackInput: { type: Type.STRING },
                  outcome: { type: Type.STRING },
                  gasUsed: { type: Type.NUMBER },
                  vulnerabilityTargeted: { type: Type.STRING }
                }
              }
            },
            gasEfficiencyScore: { type: Type.NUMBER },
            gasOptimizations: { type: Type.ARRAY, items: { type: Type.STRING } },
            heatmapData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  line: { type: Type.NUMBER },
                  risk: { type: Type.STRING },
                  score: { type: Type.NUMBER }
                }
              }
            },
            threatMonitoringData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timestamp: { type: Type.STRING },
                  event: { type: Type.STRING },
                  severity: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    }));

    const audit = JSON.parse(response.text) as ContractAudit;
    audit.totalLines = lineCount;
    audit.fileCount = fileCount;
    return audit;

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
      model: FAST_MODEL,
      config: {
        systemInstruction: `You are Rexy, the AI Smart Contract Security Partner. You are helpful, technical, and alert.
        Context:
        Current Code: ${context.code}
        Current Audit Status: ${context.audit ? JSON.stringify({ risk: context.audit.securityScore, vulcanCount: (context.audit.vulnerabilities || []).length }) : "Not Audited"}
        
        Always provide technical answers. If the user asks for a fix, guide them or explain why a fix was made in Rexy's patches.`,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
      history: history as any,
    });
    return chat.sendMessage({ message });
  });

  return result.text;
}

