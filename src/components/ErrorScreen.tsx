"use client";

import { useTranslations } from "next-intl";

export default function ErrorScreen({ onRetry }: { onRetry: () => void }) {
  const t = useTranslations("error");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-8 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full border border-neon-pink/30 bg-neon-pink/10 text-3xl">
        😕
      </span>
      <div>
        <h2 className="font-display text-lg tracking-wide text-white">{t("title")}</h2>
        <p className="mt-2 text-sm text-white/50">{t("body")}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="w-full rounded-2xl bg-neon-gradient py-4 font-display text-base tracking-wide text-white shadow-neon transition active:scale-[0.98]"
      >
        {t("retry")}
      </button>
    </div>
  );
}
