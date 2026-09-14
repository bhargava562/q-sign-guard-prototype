# Q-SignGuard — Protocol-Aware Post-Quantum Security Gateway

> **"A valid digital signature proves that a message was authorized by the corresponding signing key, but it does not automatically prove that the signed request is still valid to execute now."**

Q-SignGuard is an interactive visual security gateway prototype built to demonstrate and enforce a fundamental security distinction:

$$\text{AUTHENTICITY} \neq \text{EXECUTION VALIDITY}$$

---

## 🛡️ The Problem: Replay & Contextual Misuse of Valid Signatures

Real-world security incidents (such as the **August 2026 ICON Network replay incident**) demonstrate that attackers do not always break cryptography. Instead, previously legitimate, authentic signed transaction artifacts are captured and re-injected into systems.

Without protocol-state enforcement:
1. **Original Request**: Valid Signature $\to$ Fresh Context $\to$ **Executed**.
2. **Replayed Request**: Valid Signature $\to$ Reused Context $\to$ **Executed Again (Exploit!)**.

Q-SignGuard enforces deterministic protocol invariants to guarantee:
$$\text{One Authorized Execution Context} \longrightarrow \text{One Authorized Execution}$$

---

## 🏛️ Gateway Architecture: The Three Guards

```text
                 TRANSACTION REQUEST
                          │
                          ▼
            Canonical Context Binding (RFC 8785)
                          │
                          ▼
            ML-DSA-65 Signature Provider
                          │
                          ▼
        ══════════ SECURITY GATEWAY ══════════
                          │
                [GUARD 1: SIGNATURE GUARD]
             "Is the transaction intact?"
             (ML-DSA Cryptographic Check)
                          │
                  Passed ✓│ Failed ✕ ──► BLOCK (Signature Mismatch)
                          ▼
                 [GUARD 2: CONTEXT GUARD]
           "Are participants & sessions bound?"
            (Identity & Session Registry)
                          │
                  Passed ✓│ Failed ✕ ──► BLOCK (Session Invalid)
                          ▼
                [GUARD 3: FRESHNESS GUARD]
          "Is the authorization fresh & unused?"
           (Nonce Store, Monotonic Sequence, Expiry)
                          │
                  Passed ✓│ Failed ✕ ──► BLOCK (Replay Detected!)
                          ▼
               [ATOMIC STATE COMMIT]
              (Nonce Consumed on Pass)
                          │
                          ▼
                [EXECUTION GATE: ALLOW]
```

### 1. Guard 1 — Cryptographic Signature Guard
Verifies post-quantum cryptographic authenticity (ML-DSA-65) over the SHA-256 hash of the canonicalized context. Detects any payload or signed context tampering in transit.

### 2. Guard 2 — Context Guard
Verifies identity binding: authorized signer, legitimate recipient, and an active gateway session.

### 3. Guard 3 — Freshness & Replay Guard
Enforces deterministic protocol invariants:
- **Nonce Uniqueness**: Nonces are checked against an active replay cache and committed **only after all guards have passed**.
- **Strict Monotonic Sequence**: Enforces `sequence === lastSequence + 1` per session to prevent reordering or skipped sequences.
- **Execution Window (TTL)**: Validates `issued_at` and `expires_at` within a configurable clock tolerance ($\pm 30\text{s}$).

---

## 🔬 Core Innovation: Canonical Context Binding (RFC 8785 JCS)

Instead of signing arbitrary payloads, Q-SignGuard establishes a single, deterministic byte representation across signing and verification:

```json
{
  "expires_at": "2026-09-14T11:45:00.000Z",
  "issued_at": "2026-09-14T11:30:00.000Z",
  "message": "Transfer ₹10,000 to Bob",
  "nonce": "N-88321",
  "receiver": "Bob",
  "sender": "Alice",
  "sequence": 104,
  "session_id": "S-4821"
}
```

Every byte is bound into the SHA-256 digest before signing. Altering any field (message, session, nonce, sequence, or expiry) invalidates the signature.

---

## 🧪 Interactive Attack Laboratory

The prototype includes an interactive testbed with 1 baseline and 5 exploit scenarios:

| Scenario | Category | Authenticity | Execution | Gate Decision |
| :--- | :--- | :--- | :--- | :--- |
| **Normal Transaction** | Baseline | **VALID ✓** | **AUTHORIZED ✓** | Allowed |
| **Replay Attack (Hero)** | Attack | **VALID ✓** | **BLOCKED ✕** | Nonce Reused |
| **Message Tampering** | Attack | **INVALID ✕** | **BLOCKED ✕** | Signature Mismatch |
| **Context Tampering** | Context Abuse | **INVALID ✕** | **BLOCKED ✕** | Signature Mismatch |
| **Expired Context** | Context Abuse | **VALID ✓** | **BLOCKED ✕** | Context Expired |
| **Sequence Violation** | Context Abuse | **VALID ✓** | **BLOCKED ✕** | Sequence Out of Order |

---

## ⚛️ Quantum Telemetry (Research Mode)

The Research Mode displays live **Quantum Digital Signature (QDS)** / **QKD** channel gauges:
- **QBER (Quantum Bit Error Rate)** (Abort threshold $T_a = 8.0\%$)
- **Quantum State Fidelity** (Purity target $>90.0\%$)
- **Measurement Mismatch Rate** (Verification threshold $T_v = 11.0\%$)
- **Live Optical Oscilloscope Waveform**

> **Note:** Replay traffic exhibits quantum metrics identical to normal traffic. Replay is a protocol-state invariant, not a quantum metric classifier. The quantum layer operates as an independent physical link monitor.

---

## 💻 Tech Stack

- **Framework**: React 19 + TypeScript + Vite 8
- **Styling & Theme**: Tailwind CSS v4 + Semantic Design Tokens (Default Light Mode + Dark Console Mode)
- **Typography**: Plus Jakarta Sans + JetBrains Mono
- **State Machine**: Zustand
- **Icons**: Lucide React

---

## 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/bhargava562/q-sign-guard-prototype.git
cd q-sign-guard-prototype

# Install dependencies
npm install

# Run the dev server
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.
