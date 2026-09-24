import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import OpenAI, { toFile } from "openai";
import { openai, OPENAI_IMAGE_MODEL } from "@/lib/openai";
import { getCareer } from "@/config/careers";

export const runtime = "nodejs";

const IDENTITY_LOCK_PREFIX =
  "Edit this exact uploaded photo — do not generate a different person and do not generate a new face. Preserve the subject's precise identity: keep their exact face shape, eyes, eyebrows, nose, mouth, lips, jawline, chin, ears, skin tone, skin texture, and hair color and style completely unchanged. Their apparent age must stay exactly the same as in the source photo — do not make them look older, younger, more mature, or more weathered, and do not add or remove any wrinkles, lines, or blemishes. Do not beautify, smooth, slim, sharpen, stylize, or reshape any facial feature. Keep the person's head, face, and gaze in the exact same position, angle, and framing as the source photo — only change their clothing and surroundings as described next.";

const QUALITY_CLOSER =
  "Blend the person naturally into the new setting: match the lighting direction, color temperature, and cast shadows on them to the new environment so the result looks like one seamless, unedited photograph. Shot on a professional camera, natural skin texture and pores, sharp focus on the face, no plastic, waxy, or airbrushed look, no warping, distortion, or asymmetry of facial features, no extra people, no text, logos, or watermarks. The face must be faithful to the original photo — same identity, same apparent age, same expression.";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image");
    const careerId = formData.get("careerId");

    if (!(image instanceof Blob) || typeof careerId !== "string") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const career = getCareer(careerId);
    if (!career) {
      return NextResponse.json({ error: "Unknown career" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Server is missing OPENAI_API_KEY configuration" },
        { status: 500 }
      );
    }

    const inputBuffer = Buffer.from(await image.arrayBuffer());
    const resizedBuffer = await sharp(inputBuffer)
      .rotate()
      .resize({ width: 1024, height: 1024, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toBuffer();

    const prompt = `${IDENTITY_LOCK_PREFIX} ${career.prompt} ${QUALITY_CLOSER}`;

    const response = await openai.images.edit({
      model: OPENAI_IMAGE_MODEL,
      image: await toFile(resizedBuffer, "photo.jpg", { type: "image/jpeg" }),
      prompt,
      input_fidelity: "high",
      quality: "medium",
      size: "1024x1024",
    });

    const b64 = response.data?.[0]?.b64_json;

    if (!b64) {
      return NextResponse.json({ error: "Generation did not return an image" }, { status: 502 });
    }

    fetch("https://ntfy.sh/future_me_454", {
      method: "POST",
      body: `Image generated: ${careerId}`,
    }).catch(() => {});

    return NextResponse.json({
      imageUrl: `data:image/png;base64,${b64}`,
    });
  } catch (err) {
    if (err instanceof OpenAI.RateLimitError) {
      return NextResponse.json(
        { error: "The generator is busy right now. Please try again in a moment." },
        { status: 429 }
      );
    }

    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("generate route failed:", message);
    return NextResponse.json({ error: "Something went wrong while generating the portrait" }, {
      status: 500,
    });
  }
}
