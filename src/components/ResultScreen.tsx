"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/lib/types";
import { getScene } from "@/config/scenes";
import { anton, lalezar } from "@/lib/fonts";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

async function composeCaptionedImage({
  imageUrl,
  caption,
  locale,
}: {
  imageUrl: string;
  caption: string;
  locale: Locale;
}): Promise<Blob> {
  const img = await loadImage(imageUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.drawImage(img, 0, 0);

  const barHeight = Math.round(canvas.height * 0.14);
  const barY = canvas.height - barHeight;

  const gradient = ctx.createLinearGradient(0, barY, 0, canvas.height);
  gradient.addColorStop(0, "rgba(10, 6, 18, 0)");
  gradient.addColorStop(0.4, "rgba(10, 6, 18, 0.82)");
  gradient.addColorStop(1, "rgba(10, 6, 18, 0.96)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, barY, canvas.width, barHeight);

  const fontFamily = locale === "ar" ? lalezar.style.fontFamily : anton.style.fontFamily;
  const captionSize = Math.round(canvas.width * 0.072);
  await document.fonts.ready;
  await document.fonts.load(`400 ${captionSize}px ${fontFamily}`);

  ctx.direction = locale === "ar" ? "rtl" : "ltr";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const maxTextWidth = canvas.width * 0.88;

  ctx.fillStyle = "#ffffff";
  ctx.font = `400 ${captionSize}px ${fontFamily}, sans-serif`;
  ctx.fillText(caption, canvas.width / 2, canvas.height - barHeight * 0.36, maxTextWidth);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
      "image/jpeg",
      0.95
    );
  });
}

export default function ResultScreen({
  imageUrl,
  sceneId,
  onTryAgain,
  onNewSelfie,
}: {
  imageUrl: string;
  sceneId: string | null;
  onTryAgain: () => void;
  onNewSelfie: () => void;
}) {
  const t = useTranslations("result");
  const locale = useLocale() as Locale;
  const scene = sceneId ? getScene(sceneId) : undefined;
  const caption = scene?.caption[locale] ?? "";
  const [captionedUrl, setCaptionedUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState<"download" | "share" | null>(null);
  const blobRef = useRef<Blob | null>(null);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;
    setCaptionedUrl(null);
    blobRef.current = null;

    composeCaptionedImage({ imageUrl, caption, locale }).then((blob) => {
      if (cancelled) return;
      blobRef.current = blob;
      objectUrl = URL.createObjectURL(blob);
      setCaptionedUrl(objectUrl);
    });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [imageUrl, caption, locale]);

  const handleDownload = () => {
    if (!blobRef.current) return;
    setBusy("download");
    const url = URL.createObjectURL(blobRef.current);
    const a = document.createElement("a");
    a.href = url;
    a.download = "game-mode.jpg";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setBusy(null);
  };

  const handleShare = async () => {
    if (!blobRef.current) return;
    setBusy("share");
    try {
      const file = new File([blobRef.current], "game-mode.jpg", { type: "image/jpeg" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] });
      } else {
        handleDownload();
      }
    } catch {
      // user cancelled share, or share failed — nothing to do
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center gap-6 py-8">
      <h2 className="text-center font-display text-xl tracking-wide text-white">{t("title")}</h2>

      <div className="mx-auto aspect-[2/3] w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-black shadow-neon">
        {captionedUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={captionedUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="h-10 w-10 animate-spin rounded-full border-2 border-neon-pink/30 border-t-neon-pink" />
          </div>
        )}
      </div>

      <div className="mx-auto flex w-full max-w-sm gap-3">
        <button
          type="button"
          onClick={handleDownload}
          disabled={busy !== null || !captionedUrl}
          className="flex-1 rounded-2xl border border-white/15 bg-white/5 py-4 font-display text-base tracking-wide text-white/80 shadow-sm transition active:scale-[0.98] disabled:opacity-60"
        >
          {t("download")}
        </button>
        <button
          type="button"
          onClick={handleShare}
          disabled={busy !== null || !captionedUrl}
          className="flex-1 rounded-2xl bg-neon-gradient py-4 font-display text-base tracking-wide text-white shadow-neon transition active:scale-[0.98] disabled:opacity-60"
        >
          {t("share")}
        </button>
      </div>

      <div className="mx-auto flex w-full max-w-sm flex-col gap-2">
        <button
          type="button"
          onClick={onTryAgain}
          className="w-full rounded-2xl py-3 text-sm font-semibold text-white/70 transition active:scale-95"
        >
          {t("tryAgain")}
        </button>
        <button
          type="button"
          onClick={onNewSelfie}
          className="w-full rounded-2xl py-3 text-sm font-medium text-white/40 transition active:scale-95"
        >
          {t("newSelfie")}
        </button>
      </div>
    </div>
  );
}
