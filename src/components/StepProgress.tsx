"use client";

import type { Step } from "@/lib/types";

const FLOW_STEPS: Step[] = ["capture", "preview", "generating"];

export default function StepProgress({ step }: { step: Step }) {
  const normalized = step === "result" ? "generating" : step;
  const index = FLOW_STEPS.indexOf(normalized);
  if (index === -1) return null;

  return (
    <div
      className="mb-5 flex gap-1.5 md:mb-8"
      role="progressbar"
      aria-valuenow={index + 1}
      aria-valuemin={1}
      aria-valuemax={FLOW_STEPS.length}
    >
      {FLOW_STEPS.map((s, i) => (
        <span
          key={s}
          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
            i <= index ? "bg-neon-gradient shadow-neon-sm" : "bg-white/10"
          }`}
        />
      ))}
    </div>
  );
}
