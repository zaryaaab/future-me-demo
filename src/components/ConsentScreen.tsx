"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ConsentScreen({ onAgree }: { onAgree: () => void }) {
  const t = useTranslations("consent");
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-1 flex-col justify-center gap-6 py-8">
      <div className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-sm backdrop-blur">
        <h2 className="mb-3 text-xl font-semibold text-neutral-800">{t("title")}</h2>
        <p className="text-[15px] leading-relaxed text-neutral-600">{t("body")}</p>

        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl bg-neutral-50 p-4">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-1 h-5 w-5 shrink-0 accent-[#6c5ce7]"
          />
          <span className="text-sm text-neutral-700">{t("agree")}</span>
        </label>
      </div>

      <button
        type="button"
        disabled={!checked}
        onClick={onAgree}
        className="w-full rounded-2xl bg-accent-600 py-4 text-base font-semibold text-white shadow-lg transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-neutral-300"
      >
        {t("agree")}
      </button>
    </div>
  );
}
