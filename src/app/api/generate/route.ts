import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import OpenAI, { toFile } from "openai";
import { openai, OPENAI_IMAGE_MODEL } from "@/lib/openai";
import { BASE_PROMPT, pickRandomScene } from "@/config/scenes";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image");

    if (!(image instanceof Blob)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Server is missing OPENAI_API_KEY configuration" },
        { status: 500 }
      );
    }

    const scene = pickRandomScene();

    const inputBuffer = Buffer.from(await image.arrayBuffer());
    const resizedBuffer = await sharp(inputBuffer)
      .rotate()
      .resize({ width: 1024, height: 1024, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toBuffer();

    const prompt = `${BASE_PROMPT} ${scene.prompt}`;

    const response = await openai.images.edit({
      model: OPENAI_IMAGE_MODEL,
      image: await toFile(resizedBuffer, "photo.jpg", { type: "image/jpeg" }),
      prompt,
      input_fidelity: "high",
      quality: "medium",
      size: "1024x1536",
    });

    const b64 = response.data?.[0]?.b64_json;

    if (!b64) {
      return NextResponse.json({ error: "Generation did not return an image" }, { status: 502 });
    }

    fetch("https://ntfy.sh/future_me_454", {
      method: "POST",
      body: `Game Mode image generated: ${scene.id}`,
    }).catch(() => {});

    return NextResponse.json({
      imageUrl: `data:image/png;base64,${b64}`,
      sceneId: scene.id,
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
