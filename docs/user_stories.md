# User Stories: The LinkedIn Workflow

## User Experience (UX) Stories

| Step | User Story | Acceptance Criteria |
| :--- | :--- | :--- |
| **1. Intent** | As a creator, I want to **set a clear goal** for my post (e.g., share a lesson, tell a story) so the AI can tailor the angle and CTA correctly. | • Visual cards for 6 intents.<br>• Optional fields for Audience, Tone, and Avoid-list. |
| **2. Dump** | As a busy professional, I want to **dump my "half-baked" thoughts** into a low-friction input area so I can get ideas out without worrying about quality. | • Large, auto-growing text area.<br>• Encouraging "messy" placeholder text. |
| **3. Choose** | As a strategist, I want to **preview 3 different hook options** and post structures so I can decide which "hook" will actually stop the scroll. | • 3 generated hook/angle cards.<br>• Clear display of suggested structure/CTA.<br>• Single-selection mechanism. |
| **4. Polish** | As an editor, I want the AI to **generate a "human-sounding" draft** based on my selected hook so I don't have to deal with "corporate fluff." | • Post generated using the chosen structure.<br>• Automatic filtering of common "AI-isms."<br>• Professional formatting (line breaks, etc.). |
| **5. Adapt** | As a content marketer, I want to **generate 5 variations** (e.g., "Short," "Storytelling") so I can repurpose the content or test different formats. | • 5 distinct variant cards/tabs.<br>• One-click swap to make a variant the "final" copy. |
| **6. Publish** | As a user, I want to **edit, copy, and save** my final post so that it is ready to be pasted directly into LinkedIn. | • Inline editing of the final draft.<br>• Persistent "Save to Sessions" functionality.<br>• Export to PDF/Word/Markdown. |

## Technical User Stories (Engine Room)

| Goal | User Story | Acceptance Criteria |
| :--- | :--- | :--- |
| **Quality** | As a system, I want to **run all workflow steps through the ValidationAgent** so that we catch hallucinations or generic phrases before the user sees them. | • Quality score > 7 for all workflow outputs.<br>• Human-like guidelines enforced at the prompt level. |
| **Speed** | As a user, I want **parallel generation for variations** so that I don't have to wait 30 seconds for 5 different versions. | • Parallelized LLM calls for variations.<br>• Smooth loading states per variation card. |
| **Security** | As a system, I want to **sanitize inbound messy ideas** so that we don't leak PII or process toxic prompts. | • SecurityAgent scanning on Step 2 input. |
