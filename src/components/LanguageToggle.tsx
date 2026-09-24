"use client";

import type { Locale } from "@/lib/types";

const OPTIONS: { value: Locale; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "ar", label: "عربي" },
];

export default function LanguageToggle({
  locale,
  onChange,
}: {
  locale: Locale;
  onChange: (locale: Locale) => void;
}) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-full border border-black/10 bg-white/80 p-1 shadow-sm backdrop-blur">
      {OPTIONS.map((option) => {
        const selected = option.value === locale;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition active:scale-95 ${
              selected
                ? "bg-accent-600 text-white shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
