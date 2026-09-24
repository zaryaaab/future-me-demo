"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/lib/types";
import { getCareer, type CareerId } from "@/config/careers";
import { cairo, jakarta } from "@/lib/fonts";

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
  name,
  caption,
  appName,
  locale,
}: {
  imageUrl: string;
  name: string;
  caption: string;
  appName: string;
  locale: Locale;
}): Promise<Blob> {
  const img = await loadImage(imageUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.drawImage(img, 0, 0);

  const barHeight = Math.round(canvas.height * 0.22);
  const barY = canvas.height - barHeight;

  const gradient = ctx.createLinearGradient(0, barY, 0, canvas.height);
  gradient.addColorStop(0, "rgba(12, 10, 20, 0)");
  gradient.addColorStop(0.35, "rgba(12, 10, 20, 0.8)");
  gradient.addColorStop(1, "rgba(12, 10, 20, 0.95)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, barY, canvas.width, barHeight);

  const fontFamily = locale === "ar" ? cairo.style.fontFamily : jakarta.style.fontFamily;
  const nameSize = Math.round(canvas.width * 0.042);
  const captionSize = Math.round(canvas.width * 0.062);
  const appSize = Math.round(canvas.width * 0.026);
  await document.fonts.ready;
  await Promise.all([
    document.fonts.load(`600 ${nameSize}px ${fontFamily}`),
    document.fonts.load(`700 ${captionSize}px ${fontFamily}`),
    document.fonts.load(`600 ${appSize}px ${fontFamily}`),
  ]);

  ctx.direction = locale === "ar" ? "rtl" : "ltr";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const maxTextWidth = canvas.width * 0.88;

  if (name) {
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = `600 ${nameSize}px ${fontFamily}, sans-serif`;
    ctx.fillText(name, canvas.width / 2, canvas.height - barHeight * 0.74, maxTextWidth);
  }

  ctx.fillStyle = "#ffffff";
  ctx.font = `700 ${captionSize}px ${fontFamily}, sans-serif`;
  ctx.fillText(caption, canvas.width / 2, canvas.height - barHeight * 0.42, maxTextWidth);

  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.font = `600 ${appSize}px ${fontFamily}, sans-serif`;
  ctx.fillText(appName, canvas.width / 2, canvas.height - barHeight * 0.14, maxTextWidth);

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
  careerId,
  name,
  onTryAnother,
  onNewSelfie,
}: {
  imageUrl: string;
  careerId: CareerId;
  name: string;
  onTryAnother: () => void;
  onNewSelfie: () => void;
}) {
  const t = useTranslations("result");
  const appT = useTranslations("app");
  const locale = useLocale() as Locale;
  const career = getCareer(careerId);
  const [captionedUrl, setCaptionedUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState<"download" | "share" | null>(null);
  const blobRef = useRef<Blob | null>(null);

  useEffect(() => {
    if (!career) return;
    let cancelled = false;
    let objectUrl: string | null = null;
    setCaptionedUrl(null);
    blobRef.current = null;

    composeCaptionedImage({
      imageUrl,
      name: name.trim(),
      caption: career.caption[locale],
      appName: appT("title"),
      locale,
    }).then((blob) => {
      if (cancelled) return;
      blobRef.current = blob;
      objectUrl = URL.createObjectURL(blob);
      setCaptionedUrl(objectUrl);
    });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [imageUrl, career, locale, name, appT]);

  if (!career) return null;

  const handleDownload = () => {
    if (!blobRef.current) return;
    setBusy("download");
    const url = URL.createObjectURL(blobRef.current);
    const a = document.createElement("a");
    a.href = url;
    a.download = "future-me.jpg";
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
      const file = new File([blobRef.current], "future-me.jpg", { type: "image/jpeg" });
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
      <div className="text-center">
        <h2 className="text-xl font-semibold text-neutral-800">{t("title")}</h2>
        {name.trim() && (
          <p className="mt-1 text-sm font-semibold text-accent-600">{name.trim()}</p>
        )}
      </div>

      <div className="mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-3xl bg-neutral-900 shadow-lg">
        {captionedUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={captionedUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </div>
        )}
      </div>

      <div className="mx-auto flex w-full max-w-sm gap-3">
        <button
          type="button"
          onClick={handleDownload}
          disabled={busy !== null || !captionedUrl}
          className="flex-1 rounded-2xl border border-neutral-200 bg-white py-4 text-base font-semibold text-neutral-800 shadow-sm transition active:scale-[0.98] disabled:opacity-60"
        >
          {t("download")}
        </button>
        <button
          type="button"
          onClick={handleShare}
          disabled={busy !== null || !captionedUrl}
          className="flex-1 rounded-2xl bg-accent-600 py-4 text-base font-semibold text-white shadow-lg transition active:scale-[0.98] disabled:opacity-60"
        >
          {t("share")}
        </button>
      </div>

      <div className="mx-auto flex w-full max-w-sm flex-col gap-2">
        <button
          type="button"
          onClick={onTryAnother}
          className="w-full rounded-2xl py-3 text-sm font-semibold text-neutral-700 transition active:scale-95"
        >
          {t("tryAnother")}
        </button>
        <button
          type="button"
          onClick={onNewSelfie}
          className="w-full rounded-2xl py-3 text-sm font-medium text-neutral-400 transition active:scale-95"
        >
          {t("newSelfie")}
        </button>
      </div>
    </div>
  );
}
