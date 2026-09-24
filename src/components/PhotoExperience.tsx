"use client";

import { useEffect, useState } from "react";
import type { Locale, Step } from "@/lib/types";
import { APP_TITLE } from "@/config/app";
import { dataUrlToBlob } from "@/lib/image";
import LanguageToggle from "@/components/LanguageToggle";
import StepProgress from "@/components/StepProgress";
import ConsentScreen from "@/components/ConsentScreen";
import CaptureScreen from "@/components/CaptureScreen";
import PreviewScreen from "@/components/PreviewScreen";
import GeneratingScreen from "@/components/GeneratingScreen";
import ResultScreen from "@/components/ResultScreen";
import ErrorScreen from "@/components/ErrorScreen";

export default function PhotoExperience({
  locale,
  onLocaleChange,
}: {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}) {
  const [step, setStep] = useState<Step>("consent");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [sceneId, setSceneId] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "en" ? "ltr" : "rtl";
  }, [locale]);

  useEffect(() => {
    if (step !== "generating" || !photoDataUrl) return;

    const controller = new AbortController();

    (async () => {
      try {
        const formData = new FormData();
        formData.append("image", dataUrlToBlob(photoDataUrl), "photo.jpg");

        const res = await fetch("/api/generate", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });

        const data = await res.json();
        if (!res.ok || !data.imageUrl) {
          throw new Error(data?.error ?? "Generation failed");
        }

        setResultImageUrl(data.imageUrl);
        setSceneId(data.sceneId ?? null);
        setStep("result");
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setStep("error");
      }
    })();

    return () => controller.abort();
  }, [step, photoDataUrl]);

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-ink-950 transition-colors duration-500">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-neon-pink/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-neon-purple/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-neon-orange/10 blur-3xl"
      />

      <div className="relative mx-auto flex h-dvh w-full max-w-3xl items-center justify-center md:py-8">
        <div className="flex h-dvh w-full min-h-0 flex-col bg-ink-950 md:h-auto md:max-h-[92dvh] md:max-w-2xl md:rounded-[2.5rem] md:border md:border-white/10 md:bg-ink-900/90 md:shadow-neon md:backdrop-blur-xl">
          <div className="flex min-h-0 flex-1 flex-col px-5 pb-6 pt-5 sm:px-8 md:px-12 md:py-8">
            <header className="mb-3 flex shrink-0 items-center justify-between gap-3 md:mb-6">
              <h1 className="font-display text-lg leading-tight tracking-wide text-white sm:text-xl">
                <span className="bg-neon-gradient bg-clip-text text-transparent">
                  {APP_TITLE[locale]}
                </span>
              </h1>
              <LanguageToggle locale={locale} onChange={onLocaleChange} />
            </header>

            <div className="shrink-0">
              <StepProgress step={step} />
            </div>

            <div key={step} className="flex min-h-0 flex-1 flex-col overflow-y-auto animate-fadeIn">
              {step === "consent" && <ConsentScreen onAgree={() => setStep("capture")} />}

              {step === "capture" && (
                <CaptureScreen
                  onCaptured={(dataUrl) => {
                    setPhotoDataUrl(dataUrl);
                    setStep("preview");
                  }}
                />
              )}

              {step === "preview" && photoDataUrl && (
                <PreviewScreen
                  photoDataUrl={photoDataUrl}
                  onRetake={() => setStep("capture")}
                  onContinue={() => setStep("generating")}
                />
              )}

              {step === "generating" && <GeneratingScreen />}

              {step === "result" && resultImageUrl && (
                <ResultScreen
                  imageUrl={resultImageUrl}
                  sceneId={sceneId}
                  onTryAgain={() => {
                    setResultImageUrl(null);
                    setStep("generating");
                  }}
                  onNewSelfie={() => {
                    setPhotoDataUrl(null);
                    setResultImageUrl(null);
                    setSceneId(null);
                    setStep("capture");
                  }}
                />
              )}

              {step === "error" && (
                <ErrorScreen onRetry={() => setStep(photoDataUrl ? "generating" : "capture")} />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
