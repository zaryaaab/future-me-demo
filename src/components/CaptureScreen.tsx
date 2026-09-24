"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type Mode = "idle" | "camera";

export default function CaptureScreen({
  onCaptured,
}: {
  onCaptured: (dataUrl: string) => void;
}) {
  const t = useTranslations("capture");
  const [mode, setMode] = useState<Mode>("idle");
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStream(null);
  };

  useEffect(() => stopStream, []);

  // The <video> element only mounts once `mode` is "camera", so the stream
  // can't be attached inline inside startCamera — the ref isn't there yet.
  // Attach it here instead, once React has actually rendered the element.
  useEffect(() => {
    if (mode === "camera" && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
  }, [mode, stream]);

  const startCamera = async (nextFacingMode: "user" | "environment") => {
    setError(null);
    stopStream();
    setMode("camera");
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(t("permissionError"));
      setMode("idle");
      return;
    }
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: nextFacingMode },
        audio: false,
      });
      streamRef.current = newStream;
      setStream(newStream);
    } catch {
      setError(t("permissionError"));
      setMode("idle");
    }
  };

  const handleTakePhoto = () => {
    setFacingMode("user");
    startCamera("user");
  };

  const handleSwitchCamera = () => {
    const next = facingMode === "user" ? "environment" : "user";
    setFacingMode(next);
    startCamera(next);
  };

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    stopStream();
    setMode("idle");
    onCaptured(dataUrl);
  };

  const handleCancelCamera = () => {
    stopStream();
    setMode("idle");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onCaptured(reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="flex flex-1 flex-col justify-center gap-6 py-8">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-neutral-800">{t("title")}</h2>
        <p className="mt-2 text-sm text-neutral-500">{t("subtitle")}</p>
      </div>

      {mode === "camera" ? (
        <div className="mx-auto flex w-full max-w-sm flex-col gap-4">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-neutral-900 shadow-lg">
            <video
              ref={videoRef}
              playsInline
              muted
              className="h-full w-full object-cover"
              style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
            />
            {!stream && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              </div>
            )}
          </div>
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleCancelCamera}
              className="rounded-full bg-neutral-100 px-5 py-3 text-sm font-medium text-neutral-700 active:scale-95"
            >
              {t("cancel")}
            </button>
            <button
              type="button"
              onClick={handleCapture}
              className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-neutral-900 text-white shadow-lg active:scale-95"
              aria-label={t("capture")}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7 shrink-0"
                aria-hidden
              >
                <path d="M4 8a2 2 0 0 1 2-2h1.2a2 2 0 0 0 1.664-.89l.53-.795A2 2 0 0 1 11.06 3.5h1.88a2 2 0 0 1 1.664.89l.53.795A2 2 0 0 0 16.8 6H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" />
                <circle cx="12" cy="13" r="3.25" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleSwitchCamera}
              className="rounded-full bg-neutral-100 px-5 py-3 text-sm font-medium text-neutral-700 active:scale-95"
            >
              {t("switchCamera")}
            </button>
          </div>
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
          {error && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-center text-sm text-red-600">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={handleTakePhoto}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent-600 py-4 text-base font-semibold text-white shadow-lg transition active:scale-[0.98]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 shrink-0"
              aria-hidden
            >
              <path d="M4 8a2 2 0 0 1 2-2h1.2a2 2 0 0 0 1.664-.89l.53-.795A2 2 0 0 1 11.06 3.5h1.88a2 2 0 0 1 1.664.89l.53.795A2 2 0 0 0 16.8 6H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" />
              <circle cx="12" cy="13" r="3.25" />
            </svg>
            {t("takePhoto")}
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white py-4 text-base font-semibold text-neutral-800 shadow-sm transition active:scale-[0.98]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 shrink-0"
              aria-hidden
            >
              <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
              <circle cx="8.5" cy="9.5" r="1.5" />
              <path d="M20.5 15.5 15.7 11a1.5 1.5 0 0 0-2.18.12L9 16.5" />
            </svg>
            {t("upload")}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}
