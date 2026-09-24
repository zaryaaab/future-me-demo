"use client";

import { useTranslations } from "next-intl";

export default function ErrorScreen({ onRetry }: { onRetry: () => void }) {
  const t = useTranslations("error");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-8 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-3xl">
        😕
      </span>
      <div>
        <h2 className="text-lg font-semibold text-neutral-800">{t("title")}</h2>
        <p className="mt-2 text-sm text-neutral-500">{t("body")}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="w-full rounded-2xl bg-accent-600 py-4 text-base font-semibold text-white shadow-lg transition active:scale-[0.98]"
      >
        {t("retry")}
      </button>
    </div>
  );
}
