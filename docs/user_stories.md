# User Stories: GhostPost Workflow

This document outlines the user and technical requirements for the LinkedIn-first, multi-platform content workflow.

## Implementation Priority

| Priority | Focus | Features |
| :--- | :--- | :--- |
| **P0** | **Critical Foundation** | Platform Strategy Pattern, SecurityAgent, ValidationAgent, Intent Registry, Step 1 (Intent), Step 2 (Text Dump). |
| **P1** | **Core Value** | Step 3 (Hooks/Structure), Step 4 (Polished Post), **Voice Dictation (English)**. |
| **P2** | **Advanced Polish** | Step 5 (Variations), Step 6 (Final Output), Regenerate logic, Inline Editing, Session Persistence. |
| **P3** | **Global Expansion** | **Multi-lingual Translation**, Multi-Platform (IG, TikTok, etc.), Advanced Export. |

---

## User Experience (UX) Stories

| Step | User Story | Acceptance Criteria |
| :--- | :--- | :--- |
| **0. Platform** | As a creator, I want to **select my target platform** (starting with LinkedIn) so the AI adapts to specific constraints and cultural nuances. | • Platform selector (LinkedIn default).<br>• Strategy-based configuration per platform. |
| **1. Intent** | As a creator, I want to **choose a strategic intent** (e.g., "Tell a story," "Build authority") so the AI adopts the correct framework. | • Extensible registry of intents.<br>• Intent-specific prompt blueprints. |
| **2. Dump** | As a busy professional, I want to **dictate or type my messy thoughts** into a low-friction area so I can capture ideas while they are fresh. | • Auto-growing text area.<br>• **Voice-to-Text (Deepgram)**: Real-time, accent-robust transcription.<br>• **Translation**: Optional native-to-target language conversion. |
| **3. Choose** | As a strategist, I want to **preview 3 different hook options** and a recommended angle so I can choose the strongest entry point. | • 3 generated hook cards.<br>• Display of **Recommended Angle** and **Core Message**.<br>• Single-selection mechanism. |
| **4. Polish** | As an editor, I want the AI to **generate a "human-sounding" draft** using my chosen hook and structure, avoiding all AI-isms. | • Post generation using the chosen hook/angle.<br>• Automatic filtering of "AI-isms" (e.g., "In today's fast-paced world").<br>• Professional formatting. |
| **5. Adapt** | As a marketer, I want to **generate contextual variations** (e.g., "Short," "Authoritative") to find the perfect fit for my specific goal. | • Configurable set of variation cards.<br>• One-click swap to make a variant the final copy. |
| **6. Publish** | As a user, I want to **edit, copy, and save** my final post so that it is ready to be pasted directly into LinkedIn. | • Inline editing of the final draft.<br>• **Regenerate** capability for specific sections.<br>• Export to PDF/Word/Markdown. |

---

## Technical User Stories (Engine Room)

| Goal | User Story | Acceptance Criteria |
| :--- | :--- | :--- |
| **Strategy** | As a developer, I want to use a **Strategy Registry Pattern** for platforms and intents so that the system is easily extendable. | • Modular `PlatformStrategy` objects.<br>• Decoupled prompt builders from UI logic. |
| **Voice** | As a system, I want to use **Deepgram Nova-2 via WebSocket** to provide ultra-low latency, accent-aware transcription. | • < 300ms latency for transcription.<br>• Support for real-time punctuation and formatting. |
| **Translation** | As a global user, I want to use **Whisper/Deepgram Translation** to dictate in my native language and see target-language text. | • High-accuracy semantic translation.<br>• Support for 30+ input languages. |
| **Quality** | As a system, I want to **run all steps through the ValidationAgent** to ensure human-like quality and zero hallucinations. | • Quality score > 7 required for generation.<br>• Human-like writing guidelines enforced at the prompt level. |
| **Security** | As a system, I want to **sanitize inbound messy ideas** to prevent PII leaks or prompt injection attacks. | • SecurityAgent scanning on all user-provided text. |

---

## Task Checklist: Step-by-Step Implementation

### [P0] Critical Foundation
- [ ] **Backend**: Create `PlatformStrategy` interface and initial `LinkedInStrategy`.
- [ ] **Backend**: Implement `IntentRegistry` with core strategic blueprints.
- [ ] **Backend**: Implement `SecurityAgent` inbound scanning logic.
- [ ] **Backend**: Integrate `ValidationAgent` into the workflow pipeline.
- [ ] **Frontend**: Build `PlatformSelector` and `IntentGrid` components.
- [ ] **Frontend**: Create Step 2 "Messy Dump" text input area.

### [P1] Core Value
- [ ] **Backend**: Implement `generateStructurePrompt()` (Step 3 engine).
- [ ] **Backend**: Implement `generatePostPrompt()` (Step 4 engine).
- [ ] **Backend**: Create `/api/workflow` endpoints for Structure and Post generation.
- [ ] **Technical**: Implement Deepgram WebSocket relay for real-time dictation.
- [ ] **Frontend**: Build Step 3 Hook Selection UI.
- [ ] **Frontend**: Build Step 4 Polished Post Display.

### [P2] Advanced Polish
- [ ] **Backend**: Implement Parallel Variations engine (Step 5).
- [ ] **Backend**: Extend `Post` model for Workflow metadata persistence.
- [ ] **Frontend**: Build Step 5 Variation Matrix (Tabs/Grid).
- [ ] **Frontend**: Build Step 6 Final Editor & Export tools.
- [ ] **Frontend**: Implement Step 6 "Regenerate" section logic.

### [P3] Global Expansion
- [ ] **Technical**: Implement Multi-lingual translation in the Voice Engine.
- [ ] **Backend**: Add `InstagramStrategy` and `TikTokStrategy`.
- [ ] **Frontend**: Build platform-specific social feed previews.
