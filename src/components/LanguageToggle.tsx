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
    <div className="inline-flex shrink-0 items-center gap-0.5 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur">
      {OPTIONS.map((option) => {
        const selected = option.value === locale;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={`rounded-full px-3.5 py-1.5 font-display text-xs tracking-wide transition active:scale-95 ${
              selected
                ? "bg-neon-gradient text-white shadow-neon-sm"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
