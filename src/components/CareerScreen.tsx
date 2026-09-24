"use client";

import { useLocale, useTranslations } from "next-intl";
import { CAREERS, type CareerId } from "@/config/careers";
import type { Locale } from "@/lib/types";

export default function CareerScreen({
  onSelect,
  onBack,
}: {
  onSelect: (careerId: CareerId) => void;
  onBack: () => void;
}) {
  const t = useTranslations("career");
  const common = useTranslations("common");
  const locale = useLocale() as Locale;

  return (
    <div className="flex flex-1 flex-col justify-center gap-6 py-8">
      <div className="text-center">
        <h2 className="text-xl font-bold text-neutral-800 sm:text-2xl">{t("title")}</h2>
        <p className="mt-2 text-sm text-neutral-500">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.values(CAREERS).map((career) => (
          <button
            key={career.id}
            type="button"
            onClick={() => onSelect(career.id)}
            className="group flex flex-col items-center gap-3 rounded-3xl border border-black/5 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-50 text-3xl transition group-hover:scale-105 sm:h-20 sm:w-20 sm:text-4xl">
              {career.icon}
            </span>
            <span className="text-base font-bold text-neutral-800 sm:text-lg">
              {career.label[locale]}
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onBack}
        className="w-full rounded-2xl py-3 text-sm font-medium text-neutral-500 transition active:scale-95"
      >
        {common("back")}
      </button>
    </div>
  );
}
