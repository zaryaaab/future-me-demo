"use client";

import { useTranslations } from "next-intl";

export default function PreviewScreen({
  photoDataUrl,
  onRetake,
  onContinue,
}: {
  photoDataUrl: string;
  onRetake: () => void;
  onContinue: () => void;
}) {
  const t = useTranslations("preview");

  return (
    <div className="flex flex-1 flex-col justify-center gap-6 py-8">
      <h2 className="text-center font-display text-xl tracking-wide text-white">{t("title")}</h2>

      <div className="mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-black shadow-neon">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoDataUrl} alt="" className="h-full w-full object-cover" />
      </div>

      <div className="mx-auto flex w-full max-w-sm gap-3">
        <button
          type="button"
          onClick={onRetake}
          className="flex-1 rounded-2xl border border-white/15 bg-white/5 py-4 font-display text-base tracking-wide text-white/80 shadow-sm transition active:scale-[0.98]"
        >
          {t("retake")}
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="flex-1 rounded-2xl bg-neon-gradient py-4 font-display text-base tracking-wide text-white shadow-neon transition active:scale-[0.98]"
        >
          {t("continue")}
        </button>
      </div>
    </div>
  );
}
