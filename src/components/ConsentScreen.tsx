"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ConsentScreen({ onAgree }: { onAgree: () => void }) {
  const t = useTranslations("consent");
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-1 flex-col justify-center gap-6 py-8">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-neon-sm backdrop-blur">
        <h2 className="font-display text-xl tracking-wide text-white">{t("title")}</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-white/60">{t("body")}</p>

        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl bg-black/30 p-4">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-1 h-5 w-5 shrink-0 accent-[#ff2f92]"
          />
          <span className="text-sm text-white/80">{t("agree")}</span>
        </label>
      </div>

      <button
        type="button"
        disabled={!checked}
        onClick={onAgree}
        className="w-full rounded-2xl bg-neon-gradient py-4 font-display text-base tracking-wide text-white shadow-neon transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-none disabled:bg-white/10 disabled:text-white/30 disabled:shadow-none"
      >
        {t("agree")}
      </button>
    </div>
  );
}
