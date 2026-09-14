# Q-SignGuard — Protocol-Aware Post-Quantum Security Gateway

> **"A valid digital signature proves authorized origin, but does not make an old authorization executable again."**

Q-SignGuard is a protocol-aware security gateway for transaction systems that validates both cryptographic authenticity and execution validity before an incoming transaction is allowed to execute:

$$\text{AUTHENTICITY} \neq \text{EXECUTION VALIDITY}$$

Traditional signature verification asks:
> *"Did Alice authorize this?"*

Q-SignGuard asks:
> *"Is Alice's authorization valid for executing this request now, in this context?"*

---

## 🛡️ Target User & Operational Workflow

Built for a **Security & Transaction Operations Engineer** operating at the payment or financial infrastructure gateway level.

```text
                  STEP 0: INCOMING REQUEST
     Incoming Request TX-104 (Source: Payment API)
     Alice ───────── ₹10,000 ─────────> Bob
     Security status: ● Ready for verification
                    │
                    ▼ [ Verify & Process ]
     ──────────────────────────────────────────────────
                  STEP 1: VERIFYING REQUEST
     Brief operational feedback transit:
      ✓ Authenticity (ML-DSA-65 signature valid)
      ✓ Context (Bound to Alice → Bob, Session S-4821)
      ✓ Freshness (Authorization is fresh & unused)
      ✓ Execution (Execution authorized)
                    │
                    ▼
     ──────────────────────────────────────────────────
                  STEP 2: TRANSACTION PROCESSED
     ✓ AUTHORIZED — TX-104 (₹10,000 Alice → Bob)
     Security verification:
      Authenticity ✓ | Context ✓ | Freshness ✓ | Execution ✓
     [ View Verification Details ]
                    │
                    ▼ Security Insight:
     "This authorization has now been consumed.
      What happens if the exact same signed request arrives again?"
                    │
                    ▼ [ Process Duplicate Request ]
     ──────────────────────────────────────────────────
                  STEP 3: DUPLICATE ARRIVAL
     INCOMING REQUEST: TX-104 (Identical signature & payload)
     [ Process Request ]
                    │
                    ▼
     ──────────────────────────────────────────────────
                  STEP 4: EXECUTION BLOCKED
     ✕ BLOCKED — DUPLICATE REQUEST
     AUTHENTICITY: VALID ✓ (Alice genuinely signed this request)
     CONTEXT:      VALID ✓ (Alice → Bob, ₹10,000)
     FRESHNESS:    INVALID ✕ (Nonce N-88321 already consumed)
     ──────────────────────────────────────────────────
     HERO STATEMENT:
     "THE SIGNATURE IS VALID. THE EXECUTION IS NOT."
                    │
                    ▼
     [ View Verification Evidence ]   [ Test Another Request ]
                    │
                    ▼
     ──────────────────────────────────────────────────
                  STEP 5: EVIDENCE SHEET
     Slide-over technical drawer:
      • Cryptographic Origin (ML-DSA-65 digest)
      • Canonical Context Binding (RFC 8785 JCS, SHA-256 hash)
      • Protocol State (Session, Consumed Nonce, Monotonic Sequence)
      • Gateway Decision Code (REPLAY_NONCE_REUSED)
```

---

## 🏛️ Gateway Architecture: The Four Protocol Stages

```text
                 INCOMING TRANSACTION REQUEST
                               │
                               ▼
                 [1. CRYPTOGRAPHIC AUTHENTICITY]
                   "Did the keyholder sign this?"
                  (ML-DSA-65 Verification Provider)
                               │
                       Passed ✓│ Failed ✕ ──► BLOCK (Signature Mismatch)
                               ▼
                 [2. CANONICAL CONTEXT BINDING]
                 "What exactly was authorized?"
                 (RFC 8785 JSON Canonicalization)
                               │
                       Passed ✓│ Failed ✕ ──► BLOCK (Session Invalid)
                               ▼
                     [3. PROTOCOL FRESHNESS]
              "Can this authorization still be used?"
              (Single-use Nonce, Monotonic Sequence, TTL)
                               │
                       Passed ✓│ Failed ✕ ──► BLOCK (Replay / Consumed)
                               ▼
                    [4. ATOMIC COMMIT & GATE]
                    (State Committed on Pass Only)
                               │
                               ▼
                    [EXECUTION GATE: ALLOW]
```

### 1. Cryptographic Authenticity (ML-DSA-65)
Verifies post-quantum cryptographic authenticity (ML-DSA-65 Demo Provider) over the SHA-256 hash of the canonicalized context. Detects any payload or signed context tampering in transit.

### 2. Canonical Context Binding (RFC 8785 JCS)
Standardizes JSON serialization lexicographically so that disparate software stacks produce the exact same byte representation:
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

### 3. Protocol Freshness Guard
Enforces deterministic protocol invariants:
- **Nonce Uniqueness**: Nonces are checked against an active replay cache and committed **only after all guards have passed**.
- **Strict Monotonic Sequence**: Enforces `sequence === lastSequence + 1` per session to prevent reordering or skipped sequences.
- **Execution Window (TTL)**: Validates timestamps within a configurable clock tolerance ($\pm 30\text{s}$).

### 4. Execution Gate
Only releases funds or executes the operation if all invariants hold true, preventing stale or duplicated authorizations from ever being executed.

---

## 🔬 Research Foundation: Quantum Communication Simulation

The **Learn** section includes a dedicated **Quantum Channel Simulation (CV-QDS Concept)** layer:
- **QBER (Quantum Bit Error Rate)** (Abort threshold $T_a = 8.0\%$)
- **Quantum State Fidelity** (Purity target $>90.0\%$)
- **Measurement Mismatch Rate** (Verification threshold $T_v = 11.0\%$)
- **Simulated Phase Quadrature Waveform**

> **Core Research Finding:** Physical channel health and protocol-state execution validity operate at independent layers. A replayed packet travels over a physically normal, healthy quantum channel. Therefore, physical link metrics alone cannot detect or prevent transaction replays — deterministic protocol-state gateway invariants are strictly necessary.

---

## 💻 Tech Stack & Navigation

- **Framework**: React 19 + TypeScript + Vite 8
- **Styling & Theme**: Tailwind CSS v4 + Semantic Design Tokens (Default Light Mode + Dark Console Mode)
- **Typography**: Plus Jakarta Sans + JetBrains Mono
- **State Machine**: Zustand
- **Icons**: Lucide React

### Three-Item Navigation
- **`Protect`**: The primary operational workflow (Incoming Request $\to$ Verify $\to$ Receipt $\to$ Duplicate Arrival $\to$ Block).
- **`Learn`**: Educational breakdown of why signatures aren't enough + Quantum Research Simulation.
- **`Activity`**: Operational transaction history ledger with direct Evidence Sheet triggers.

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
