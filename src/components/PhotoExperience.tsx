"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { Locale, Step } from "@/lib/types";
import type { CareerId } from "@/config/careers";
import { dataUrlToBlob } from "@/lib/image";
import LanguageToggle from "@/components/LanguageToggle";
import StepProgress from "@/components/StepProgress";
import ConsentScreen from "@/components/ConsentScreen";
import NameScreen from "@/components/NameScreen";
import CaptureScreen from "@/components/CaptureScreen";
import PreviewScreen from "@/components/PreviewScreen";
import CareerScreen from "@/components/CareerScreen";
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
  const t = useTranslations();
  const [step, setStep] = useState<Step>("consent");
  const [name, setName] = useState("");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [careerId, setCareerId] = useState<CareerId | null>(null);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "en" ? "ltr" : "rtl";
  }, [locale]);

  useEffect(() => {
    if (step !== "generating" || !photoDataUrl || !careerId) return;

    const controller = new AbortController();

    (async () => {
      try {
        const formData = new FormData();
        formData.append("image", dataUrlToBlob(photoDataUrl), "photo.jpg");
        formData.append("careerId", careerId);

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
        setStep("result");
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setStep("error");
      }
    })();

    return () => controller.abort();
  }, [step, photoDataUrl, careerId]);

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-gradient-to-b from-accent-50 via-white to-white transition-colors duration-500 md:bg-neutral-100">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 hidden h-96 w-96 rounded-full bg-accent-200/40 blur-3xl md:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 hidden h-96 w-96 rounded-full bg-accent-100/50 blur-3xl md:block"
      />

      <div className="relative mx-auto flex h-dvh w-full max-w-3xl items-center justify-center md:py-8">
        <div className="flex h-dvh w-full min-h-0 flex-col bg-gradient-to-b from-accent-50 via-white to-white md:h-auto md:max-h-[92dvh] md:max-w-2xl md:rounded-[2.5rem] md:border md:border-black/5 md:bg-white/90 md:shadow-2xl md:shadow-black/10 md:backdrop-blur-xl">
          <div className="flex min-h-0 flex-1 flex-col px-5 pb-6 pt-5 sm:px-8 md:px-12 md:py-8">
            <header className="mb-3 flex shrink-0 items-center justify-between md:mb-6">
              <h1 className="text-base font-semibold text-neutral-800 sm:text-lg">
                {t("app.title")}
              </h1>
              <LanguageToggle locale={locale} onChange={onLocaleChange} />
            </header>

            <div className="shrink-0">
              <StepProgress step={step} />
            </div>

            <div key={step} className="flex min-h-0 flex-1 flex-col overflow-y-auto animate-fadeIn">
              {step === "consent" && <ConsentScreen onAgree={() => setStep("name")} />}

              {step === "name" && (
                <NameScreen
                  name={name}
                  onNameChange={setName}
                  onContinue={() => setStep("capture")}
                />
              )}

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
                  onContinue={() => setStep("career")}
                />
              )}

              {step === "career" && (
                <CareerScreen
                  onSelect={(id) => {
                    setCareerId(id);
                    setStep("generating");
                  }}
                  onBack={() => setStep("preview")}
                />
              )}

              {step === "generating" && <GeneratingScreen />}

              {step === "result" && resultImageUrl && careerId && (
                <ResultScreen
                  imageUrl={resultImageUrl}
                  careerId={careerId}
                  name={name}
                  onTryAnother={() => {
                    setResultImageUrl(null);
                    setStep("career");
                  }}
                  onNewSelfie={() => {
                    setPhotoDataUrl(null);
                    setCareerId(null);
                    setResultImageUrl(null);
                    setStep("capture");
                  }}
                />
              )}

              {step === "error" && (
                <ErrorScreen onRetry={() => setStep(careerId ? "generating" : "capture")} />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
