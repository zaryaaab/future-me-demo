"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function GeneratingScreen() {
  const t = useTranslations("generating");
  const tips = t.raw("tips") as string[];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % tips.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 py-8 text-center">
      <div className="relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-black/40">
        <span
          aria-hidden
          className="absolute inset-0 animate-scanline bg-gradient-to-b from-transparent via-neon-pink/25 to-transparent"
        />
        <span className="absolute inset-0 rounded-3xl bg-neon-gradient opacity-20 blur-xl" />
        <span className="relative h-16 w-16 animate-glowPulse rounded-full bg-neon-gradient shadow-neon" />
      </div>

      <div>
        <h2 className="font-display text-lg tracking-wide text-white">{t("title")}</h2>
        <p key={index} className="mt-3 min-h-[1.5rem] text-sm text-white/50 animate-fadeIn">
          {tips[index]}
        </p>
      </div>

      <div className="h-1.5 w-full max-w-[220px] overflow-hidden rounded-full bg-white/10">
        <span className="block h-full w-1/3 animate-[glowPulse_1.4s_ease-in-out_infinite] rounded-full bg-neon-gradient" />
      </div>
    </div>
  );
}
