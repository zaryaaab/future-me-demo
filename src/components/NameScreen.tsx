"use client";

import { useTranslations } from "next-intl";

export default function NameScreen({
  name,
  onNameChange,
  onContinue,
}: {
  name: string;
  onNameChange: (name: string) => void;
  onContinue: () => void;
}) {
  const t = useTranslations("name");
  const trimmed = name.trim();

  return (
    <div className="flex flex-1 flex-col justify-center gap-6 py-8">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-neutral-800">{t("title")}</h2>
        <p className="mt-2 text-sm text-neutral-500">{t("subtitle")}</p>
      </div>

      <div className="mx-auto w-full max-w-sm">
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && trimmed) onContinue();
          }}
          placeholder={t("placeholder")}
          autoFocus
          maxLength={40}
          className="w-full rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-center text-lg font-medium text-neutral-800 shadow-sm outline-none transition focus:border-accent-400 focus:ring-2 focus:ring-accent-100"
        />
      </div>

      <div className="mx-auto w-full max-w-sm">
        <button
          type="button"
          disabled={!trimmed}
          onClick={onContinue}
          className="w-full rounded-2xl bg-accent-600 py-4 text-base font-semibold text-white shadow-lg transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          {t("continue")}
        </button>
      </div>
    </div>
  );
}
