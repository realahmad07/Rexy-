# RexAudit: Neural Smart Contract Security Engine

**RexAudit** (Codename: Rexy) is a high-fidelity, AI-powered security auditor designed for the next generation of smart contracts. By combining the reasoning capabilities of the **Gemini 2.0 Flash Neural Engine** with advanced visualization techniques, RexAudit provides developers with an "X-ray" view of their code's security and efficiency.

---

## 🛡️ Supported Auditor Ecosystems

While RexAudit is language-agnostic at its core, it is specifically tuned for:

1.  **Solidity (Ethereum, EVM L2s):**
    *   Deep analysis of Hardhat/Foundry/Truffle structures.
    *   Specialized checks for Reentrancy, Delegatecall exploits, and Gas Optimization.
2.  **Rust / Anchor (Solana):**
    *   Targeted detection of Account Ownership bugs and Signer Verification flaws.
    *   Security analysis of Anchor macros and state machine transitions.
3.  **JavaScript / TypeScript:**
    *   Auditing of Web3 integration logic, deployment scripts, and backend protocols.
    *   Detection of hardcoded secrets and logic flaws in automation bots.

---

## 🚀 Key Features

### 1. **Neural Trace Heatmap**
*   **Visual Bytecode Analysis:** Identifies "hot zones" in your code where logic density and risk overlap.
*   **Precision Indexing:** Maps AI-detected vulnerabilities (Reentrancy, Logic Flaws, Access Control) directly to specific lines of code.

### 2. **Gas Optimization Protocol**
*   **Efficiency Indexing:** Calculates a dedicated Gas Efficiency Score (0-100%).
*   **Automated Efficiency Patches:** Suggests storage packing, visibility modifiers, and cold-state optimizations to save user gas fees.

### 3. **Neural Simulation Feed**
*   **Immersive Diagnostics:** Watch the AI engine perform bytecode parsing, threat indexing, and logic simulations in a live terminal environment.
*   **Symbolic Execution Modeling:** AI simulates attack vectors (Flashloan, Reentrancy) to verify logic resilience.

### 4. **Enterprise PDF Certification**
*   **Proof of Audit:** Generate high-impact, professional audit reports instantly.
*   **Technical Integrity:** Includes the Security Index, Gas Efficiency Rating, and the Neural Heatmap summary in a printable format.

---

## 🛠️ Technical Stack

- **AI Core:** Google Gemini 2.0 Flash (via `@google/genai`)
- **Frontend Framework:** React 18 & Vite
- **Styling:** Tailwind CSS (Cyber-Brutalist/Saas Aesthetic)
- **Animations:** Framer Motion (motion/react)
- **Visuals:** D3.js (Dependency Graphs) & Custom CSS Heatmap Engines

---

## 📦 Getting Started (Local Development)

To run the RexAudit engine locally:

1.  **Clone the Repository:**
    ```bash
    git clone <your-repo-url>
    cd rexaudit
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Set Environment Variables:**
    Create a `.env` file and add your Gemini API Key:
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```
4.  **Start the Engine:**
    ```bash
    npm run dev
    ```

---

## 🏆 Submission Information
This project is built for the intersection of **AI and Blockchain**. It solves the problem of expensive, slow manual audits by providing deep, context-aware automated analysis using the most advanced Large Language Models available today.

---
© 2026 RexAudit Engineering. All Rights Reserved.
