
export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export interface ContractFile {
  name: string;
  content: string;
}

export interface Vulnerability {
  title: string;
  severity: Severity;
  confidence: number; // 0-100
  fileName: string;
  lineNumbers: number[];
  description: string;
  impact: string;
  remediation: string;
  exploitPoC?: string;
  codeSnippet?: string;
}

export interface LogicFlowStep {
  from: string;
  to: string;
  action: string;
  isRisky: boolean;
  description: string;
}

export interface DependencyNode {
  id: string;
  type: string;
  risk: string;
}

export interface DependencyLink {
  source: string;
  target: string;
  relation: string;
}

export interface FuzzingScenario {
  name: string;
  description: string;
  attackInput: string;
  outcome: string;
  gasUsed: number;
  vulnerabilityTargeted: string;
}

export interface ThreatMetric {
  timestamp: string;
  event: string;
  severity: string;
}

export interface ContractAudit {
  name: string;
  language: string;
  framework: string;
  fileCount: number;
  totalLines: number;
  securityScore: number;
  riskLevel: Severity;
  summary: string;
  financialRiskSummary: string;
  logicRiskSummary: string;
  vulnerabilities: Vulnerability[];
  safeCodeSnippet: string;
  dependencyGraph: {
    nodes: DependencyNode[];
    links: DependencyLink[];
  };
  fuzzingSimulation: FuzzingScenario[];
  threatMonitoringData: ThreatMetric[];
  logicFlow: LogicFlowStep[];
  finalVerdict: string;
  architectureReview: string;
  gasEfficiencyScore: number;
  gasOptimizations: string[];
  heatmapData: {
    line: number;
    risk: 'high' | 'medium' | 'low';
    score: number;
  }[];
}
