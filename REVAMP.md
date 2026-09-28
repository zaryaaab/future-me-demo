Goal

Revamp the existing “Future Me” prototype into a child-focused AI image experience for ages 4+. Keep the existing architecture/design where practical. Do not overengineer or add storybooks, multiple outputs, accounts, galleries, etc.

Core flow:

Parent consent → Child name → Photo → Choose adventure → Generate ONE image → Result/download/share

1. Product Revamp

Rebrand the experience from career-focused “Future Me” to a playful child experience such as Little Dreamer / My Adventure.

Primary messaging:

* “Choose their adventure”
* “Watch their imagination come to life.”
* Audience: parent/guardian
* Child remains their real/current age; never age them into an adult.

Keep the UI polished and minimal. Make it warmer/playful for children without making the interface overly cartoonish. Preserve the current design language, layout quality, animations, responsiveness, and overall flow wherever possible.

2. Flow

Step 1 — Parent/Guardian Consent

Replace existing consent with child-appropriate wording.

Clearly state:

* Parent/guardian is uploading the child’s photo.
* Photo is sent to the AI provider for generation.
* The application itself does not persist the uploaded photo.
* Avoid absolute privacy claims that cannot be guaranteed.

Step 2 — Child Name

Keep existing name step.

Copy:
“What’s your little explorer’s name?”

Step 3 — Photo

Keep camera + upload functionality.

Add short guidance:

* One child only
* Face clearly visible
* Good lighting
* Look toward camera

Keep preview/retake behavior.

Step 4 — Choose Adventure

Replace careers with exactly 4 options:

1. Space Explorer 🚀
2. Dinosaur Explorer 🦕
3. Junior Scientist 🔬
4. Little Chef 👨‍🍳

Each should have a polished visual card consistent with the existing UI.

Step 5 — Generation

Generate exactly ONE image.

Use playful progress copy such as:

* “Creating {name}’s adventure…”
* “Preparing their world…”
* “Almost ready…”

Prevent duplicate submissions while generation is active.

Step 6 — Result

Show one polished generated image.

Heading:
“{name}’s {Adventure}”

Optional short line:
“Dream big ✨”

Keep:

* Download
* Share
* Try another adventure

“Try another” should return to adventure selection without unnecessarily losing the uploaded image.

3. Image Generation Prompts

Create one shared child identity-preservation prefix.

Requirements:

* Preserve the same child’s identity.
* Preserve apparent/current age exactly.
* Never make child older/younger or adult-like.
* Preserve facial proportions, eyes, nose, mouth, skin tone, hair and identifying features.
* Natural child proportions.
* Wholesome and age-appropriate.
* Photorealistic.
* Avoid unnecessary facial/expression changes.
* Change primarily clothing/environment/scene.

Remove adult-specific instructions from current prompt such as wrinkles, weathering, slimming, etc.

Create concise scene prompts for the 4 adventures.

Space Explorer:
Age-appropriate astronaut suit, impressive colorful space-station environment.

Dinosaur Explorer:
Young explorer outfit, lush prehistoric environment, friendly/non-threatening dinosaurs.

Junior Scientist:
Age-appropriate scientist outfit, bright modern lab, fun experiment elements.

Little Chef:
Child chef outfit, warm colorful professional kitchen, fun cooking/baking environment.

Keep prompts concise. Avoid conflicting instructions.

4. Cost Optimization

Do NOT keep gpt-image-1 as the default without benchmarking.

Create centralized image-generation configuration so model/quality/fidelity can easily be changed.

Default prototype configuration to test first:

* model: gpt-image-1-mini
* size: 1024x1024
* quality: medium
* one output only

Retain high input fidelity initially if needed for identity preservation, but make it configurable.

Make configuration easy to switch via constants/env vars so we can compare:

* Mini + low
* Mini + medium
* newer higher-quality GPT Image model if needed

Do not sacrifice recognizable child identity purely for cost. Mini Medium should be the initial cost/quality target.

5. Input Optimization

Optimize uploaded image before sending.

Target approximately:

* max dimensions: 768x768 where practical
* JPEG
* quality ~80
* withoutEnlargement: true

Do not process larger images than necessary.

Preserve enough facial detail for identity matching.

6. Output Optimization

Request JPEG output directly where supported rather than receiving PNG and converting later.

Target:

* JPEG
* compression ~80–85%

Remove unnecessary client-side PNG→JPEG conversion if API output already provides JPEG.

Keep download/share working.

7. Duplicate-Cost Protection

Prevent accidental repeated API charges.

Implement:

* Disable Generate while request is active.
* Protect against double-click/double-submit.
* Generate deterministic request key/hash from relevant inputs, e.g. image + adventure + prompt version.
* Cache/reuse identical completed generations where practical.
* Ensure browser retries/navigation do not blindly trigger duplicate generations.

Keep implementation lightweight for the prototype.

8. API Protection

Protect /api/generate.

Add lightweight:

* Per-IP/session rate limiting.
* Generation cooldown.
* Max upload size.
* MIME/type validation.
* Only accepted image formats.
* Global/demo generation limit configurable through environment variables where practical.
* Clean errors when limits are reached.

Do not expose OpenAI credentials client-side.

9. Error Handling

Handle:

* OpenAI/API failure
* rate limit
* invalid image
* oversized upload
* generation timeout
* malformed API response
* exhausted demo allowance

Give user-friendly messages and allow retry without forcing them through the entire flow again.

Never automatically retry paid image generation multiple times without explicit safeguards.

10. Lightweight Cost/Performance Logging

Server-side log useful generation metadata without storing child photos:

* model
* quality
* adventure
* generation duration
* success/failure
* input image size
* cache hit/miss
* retry status

If API usage/cost metadata is available, log it.

Do not log base64 image contents or unnecessary personal information.

11. Cleanup

While implementing:

* Reuse existing components/architecture.
* Remove obsolete adult-career copy/prompts/assets.
* Remove dead generation logic.
* Keep TypeScript types clean.
* Avoid unnecessary dependencies.
* Avoid broad refactors unrelated to this task.
* Preserve responsive/mobile behavior.

12. Validation

Before finishing, test all four adventures.

Verify:

* child remains recognizably the same person
* apparent age does not change
* scenes are age-appropriate
* only one image is generated per request
* camera/upload both work
* download/share work
* Try Another works
* duplicate clicks don’t create multiple generations
* rate limiting works
* errors recover cleanly
* no child image is accidentally logged/persisted
* mobile layout works

Run lint/typecheck/build and fix regressions.

Implementation Approach

First inspect the existing codebase and identify the current flow, components, prompts and /api/generate implementation.

Then make the smallest coherent changes necessary to implement everything above.

Do not redesign working architecture unnecessarily.

Do not add features beyond this scope.

At completion, summarize:

1. files changed
2. UX changes
3. generation configuration
4. cost optimizations
5. API protections
6. any remaining tradeoffs or recommendations