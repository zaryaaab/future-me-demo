import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import OpenAI, { toFile } from "openai";
import { openai } from "@/lib/openai";
import {
  IMAGE_MODEL,
  IMAGE_QUALITY,
  IMAGE_SIZE,
  IMAGE_INPUT_FIDELITY,
  IMAGE_OUTPUT_FORMAT,
  IMAGE_OUTPUT_COMPRESSION,
  PROMPT_VERSION,
} from "@/lib/generationConfig";
import { checkRateLimit, recordGeneration, getClientIp } from "@/lib/rateLimit";
import { generationKey, runDeduped } from "@/lib/generationCache";
import { getAdventure } from "@/config/adventures";

export const runtime = "nodejs";

const IDENTITY_LOCK_PREFIX =
  "Edit this exact uploaded photo of a child — do not generate a different person and do not generate a new face. Preserve the child's precise identity: keep their exact face shape, eyes, eyebrows, nose, mouth, lips, jawline, chin, ears, skin tone, skin texture, and hair color and style completely unchanged, matching the source photo. Preserve their exact current apparent age — do not make them look older, younger, more mature, or adult-like in any way; keep natural child body and facial proportions. Do not beautify, slim, sharpen, stylize, or reshape any facial feature, and avoid unnecessary changes to their expression. The image must be wholesome and age-appropriate. Only change their clothing, pose, and surroundings as described next.";

const COMPOSITION_CLOSER =
  "Compose this as a wider three-quarter or full-body shot so the child is genuinely present within their environment and interacting with it, not a tight headshot or a cutout pasted over a background — the setting and its surrounding details should be clearly visible around them. Blend the child naturally into the scene: match the lighting direction, color temperature, and cast shadows on them to the new environment so the result looks like one seamless, unedited photograph. Shot on a professional camera, natural skin texture, sharp focus on the face, no plastic, waxy, or airbrushed look, no warping, distortion, or asymmetry of facial features, no extra people, no text, logos, or watermarks. The face must be faithful to the original photo — same identity, same apparent age.";

const ACCEPTED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_UPLOAD_BYTES = Number(process.env.MAX_UPLOAD_BYTES || 8 * 1024 * 1024);
const GENERATION_TIMEOUT_MS = Number(process.env.GENERATION_TIMEOUT_MS || 60 * 1000);

function jsonError(error: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ error, ...extra }, { status });
}

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  const ip = getClientIp(req.headers);
  let adventureId: string | undefined;
  let inputImageBytes = 0;
  let cacheHit = false;
  let outcome: "success" | "failure" = "failure";

  try {
    if (!process.env.OPENAI_API_KEY) {
      return jsonError("Server is missing OPENAI_API_KEY configuration", 500);
    }

    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.ok) {
      const status = rateCheck.reason === "global_limit" ? 403 : 429;
      const message =
        rateCheck.reason === "cooldown"
          ? "Please wait a moment before creating another adventure."
          : rateCheck.reason === "global_limit"
            ? "This demo has reached its generation limit for now. Please try again later."
            : "Too many requests. Please try again shortly.";
      return jsonError(message, status, { retryAfterMs: rateCheck.retryAfterMs });
    }

    const formData = await req.formData();
    const image = formData.get("image");
    const rawAdventureId = formData.get("adventureId");

    if (!(image instanceof Blob) || typeof rawAdventureId !== "string") {
      return jsonError("Invalid request", 400);
    }
    adventureId = rawAdventureId;

    if (!ACCEPTED_MIME_TYPES.has(image.type)) {
      return jsonError("Unsupported image type. Please use JPEG, PNG, or WEBP.", 400);
    }

    if (image.size > MAX_UPLOAD_BYTES) {
      return jsonError("Photo is too large. Please use a smaller photo.", 413);
    }

    const adventure = getAdventure(adventureId);
    if (!adventure) {
      return jsonError("Unknown adventure", 400);
    }

    const inputBuffer = Buffer.from(await image.arrayBuffer());
    inputImageBytes = inputBuffer.byteLength;

    const resizedBuffer = await sharp(inputBuffer)
      .rotate()
      .resize({ width: 768, height: 768, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    const key = generationKey(resizedBuffer, adventureId, PROMPT_VERSION);
    const prompt = `${IDENTITY_LOCK_PREFIX} ${adventure.prompt} ${COMPOSITION_CLOSER}`;

    const { imageUrl, cacheHit: hit } = await runDeduped(key, async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), GENERATION_TIMEOUT_MS);

      try {
        const response = await openai.images.edit(
          {
            model: IMAGE_MODEL,
            image: await toFile(resizedBuffer, "photo.jpg", { type: "image/jpeg" }),
            prompt,
            ...(IMAGE_INPUT_FIDELITY ? { input_fidelity: IMAGE_INPUT_FIDELITY } : {}),
            quality: IMAGE_QUALITY,
            size: IMAGE_SIZE as "1024x1024",
            output_format: IMAGE_OUTPUT_FORMAT as "jpeg",
            output_compression: IMAGE_OUTPUT_COMPRESSION,
            n: 1,
          },
          { signal: controller.signal }
        );

        const b64 = response.data?.[0]?.b64_json;
        if (!b64) {
          throw new Error("Generation did not return an image");
        }
        return `data:image/${IMAGE_OUTPUT_FORMAT};base64,${b64}`;
      } finally {
        clearTimeout(timeout);
      }
    });

    cacheHit = hit;
    if (!cacheHit) {
      recordGeneration(ip);
    }

    fetch("https://ntfy.sh/future_me_454", {
      method: "POST",
      body: `Image generated: ${adventureId}`,
    }).catch(() => {});

    outcome = "success";
    return NextResponse.json({ imageUrl });
  } catch (err) {
    if (err instanceof OpenAI.RateLimitError) {
      return jsonError("The generator is busy right now. Please try again in a moment.", 429);
    }

    if (err instanceof Error && err.name === "AbortError") {
      return jsonError("This is taking longer than expected. Please try again.", 504);
    }

    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("generate route failed:", message);
    return jsonError("Something went wrong while creating the adventure", 500);
  } finally {
    console.log(
      JSON.stringify({
        route: "/api/generate",
        model: IMAGE_MODEL,
        quality: IMAGE_QUALITY,
        adventureId: adventureId ?? null,
        durationMs: Date.now() - startedAt,
        outcome,
        inputImageBytes,
        cacheHit,
        retryStatus: "none",
      })
    );
  }
}
