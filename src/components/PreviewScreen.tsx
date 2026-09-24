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
      <h2 className="text-center text-xl font-semibold text-neutral-800">{t("title")}</h2>

      <div className="mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-3xl bg-neutral-900 shadow-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoDataUrl} alt="" className="h-full w-full object-cover" />
      </div>

      <div className="mx-auto flex w-full max-w-sm gap-3">
        <button
          type="button"
          onClick={onRetake}
          className="flex-1 rounded-2xl border border-neutral-200 bg-white py-4 text-base font-semibold text-neutral-800 shadow-sm transition active:scale-[0.98]"
        >
          {t("retake")}
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="flex-1 rounded-2xl bg-accent-600 py-4 text-base font-semibold text-white shadow-lg transition active:scale-[0.98]"
        >
          {t("continue")}
        </button>
      </div>
    </div>
  );
}
