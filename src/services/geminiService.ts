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

export function generateSimulationResult(files: ContractFile[]): ContractAudit {
  return {
    name: "Rexy-Gold-Vault-v4",
    language: "Solidity",
    framework: "Hardhat (Foundry Integrated)",
    securityScore: 42,
    riskLevel: "High",
    totalLines: 1240,
    fileCount: files.length,
    summary: "The Rexy-Gold-Vault-v4 protocol was subjected to a comprehensive neural bytecode analysis. Initial findings indicate significant structural weaknesses in the state management layer, specifically regarding the handling of asynchronous external calls. While the protocol implements standard ERC-20 interfaces, the reentrancy protection is absent in critical withdrawal paths.",
    financialRiskSummary: "Total Value Locked (TVL) estimated at $4.2M is at immediate risk. Exploitation of the identified reentrancy vector would allow an attacker to drain the entire vault balance in a single transaction block. Recommendation: Immediate suspension of deposit transactions until the patch is applied.",
    logicRiskSummary: "Logic breakdown reveals a 'Check-Interaction-Effect' pattern which is fundamentally insecure. Secondary risks include an insecure ownership transfer process that lacks a two-step confirmation, potentially leading to permanent loss of administrative control.",
    vulnerabilities: [
      {
        title: "Recursive Call Reentrancy",
        severity: "Critical",
        confidence: 98,
        fileName: files[0]?.name || "Vault.sol",
        lineNumbers: [88, 92],
        description: "The withdraw function transfers ETH to the caller before updating the internal ledger. This allows a malicious contract to trigger the fallback function and re-enter the vault.",
        impact: "Complete drainage of contract funds (Estimated Loss: 100% TVL).",
        remediation: "Implement the Checks-Effects-Interactions pattern by moving the balance update before the external call, or use OpenZeppelin's ReentrancyGuard.",
        exploitPoC: "function attack() external payable { vault.deposit{value: 1 ether}(); vault.withdraw(); }",
        codeSnippet: "msg.sender.call{value: amount}(\"\");\nbalances[msg.sender] -= amount;"
      },
      {
        title: "Insecure Ownership Transfer",
        severity: "Medium",
        confidence: 95,
        fileName: files[0]?.name || "Vault.sol",
        lineNumbers: [205],
        description: "Ownership is transferred in a single transaction without validation of the new owner's capabilities.",
        impact: "Setting a wrong address as owner leads to permanent lockout of administrative functions.",
        remediation: "Use a two-step ownership transfer process (claimable ownership).",
        exploitPoC: "vault.transferOwnership(address(0));",
        codeSnippet: "function transferOwnership(address newOwner) public onlyOwner { owner = newOwner; }"
      }
    ],
    logicFlow: [
      { from: "User", to: "Vault", action: "deposit()", isRisky: false, description: "Funds added to user mapping" },
      { from: "Vault", to: "User", action: "call{value: bal}()", isRisky: true, description: "External call with value" },
      { from: "Vault", to: "Vault", action: "balances[msg.sender] = 0", isRisky: false, description: "Balance reset after transfer" }
    ],
    safeCodeSnippet: "// Patch V4.1 - Secure Checks-Effects-Interactions\nfunction withdraw(uint amount) public {\n    uint bal = balances[msg.sender];\n    require(bal >= amount, \"Insufficient funds\");\n    \n    // 1. Effect: Update balance BEFORE transfer\n    balances[msg.sender] -= amount;\n    \n    // 2. Interaction: Transfer funds\n    (bool sent, ) = msg.sender.call{value: amount}(\"\");\n    require(sent, \"Transfer failed\");\n}",
    finalVerdict: "Needs Fixes",
    architectureReview: "The architecture follows a standard vault pattern but lacks defensive depth. Modern smart contracts should utilize a multi-layered defense strategy, including modular reentrancy guards and rate-limiting on large withdrawals. The current implementation relies on single-factor auth which is suboptimal for high-value protocols.",
    gasEfficiencyScore: 78,
    gasOptimizations: [
      "Use 'unchecked' for arithmetic that cannot overflow to save gas.",
      "Replace 'public' visibility with 'external' for read-only functions.",
      "Pack storage variables by ordering types (e.g., uint128 next to uint128)."
    ],
    heatmapData: [
      { line: 42, risk: 'low', score: 20 },
      { line: 88, risk: 'high', score: 95 },
      { line: 92, risk: 'high', score: 90 },
      { line: 120, risk: 'medium', score: 45 }
    ],
    dependencyGraph: {
      nodes: [
        { id: "Owner", type: "User", risk: "Low" },
        { id: "Vault", type: "Contract", risk: "High" },
        { id: "Router", type: "Contract", risk: "Low" },
        { id: "Attacker", type: "User", risk: "Critical" }
      ],
      links: [
        { source: "Owner", target: "Vault", relation: "manage" },
        { source: "Attacker", target: "Vault", relation: "exploit" },
        { source: "Vault", target: "Router", relation: "delegate" }
      ]
    },
    fuzzingSimulation: [
      { name: "Recursive Reentrancy Scan", description: "Simulating malicious fallback contract interactions.", attackInput: "0x8920...34f1", outcome: "Failed (State Change Detected)", gasUsed: 230450, vulnerabilityTargeted: "Reentrancy" },
      { name: "Arithmetic Overflow Test", description: "Fuzzing deposit/withdraw values with MAX_UINT.", attackInput: "0xfff...ffff", outcome: "Success (Safe Revert)", gasUsed: 45000, vulnerabilityTargeted: "Overflow" },
      { name: "Access Control Breach", description: "Testing restricted functions from non-owner accounts.", attackInput: "0x000...abcd", outcome: "Success (Unauthorized)", gasUsed: 21000, vulnerabilityTargeted: "Auth" }
    ],
    threatMonitoringData: [
      { timestamp: "2026-04-18 10:00:00", event: "Anomalous Gas Spike", severity: "High" },
      { timestamp: "2026-04-18 10:05:00", event: "Sequence Detection: Reentrancy Pattern", severity: "Critical" }
    ]
  };
}
