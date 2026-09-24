"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function GeneratingScreen() {
  const t = useTranslations("generating");
  const messages = t.raw("messages") as string[];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 py-8 text-center">
      <div className="relative flex h-40 w-40 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-accent-400 opacity-40" />
        <span className="absolute inset-3 animate-pulse rounded-full bg-accent-500 opacity-60" />
        <span className="relative h-16 w-16 rounded-full bg-accent-600 shadow-lg" />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-neutral-800">{t("title")}</h2>
        <p key={index} className="mt-3 min-h-[1.5rem] text-sm text-neutral-500 animate-fadeIn">
          {messages[index]}
        </p>
      </div>
    </div>
  );
}
