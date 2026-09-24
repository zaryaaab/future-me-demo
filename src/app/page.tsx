"use client";

import { useState } from "react";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import ar from "@/messages/ar.json";
import en from "@/messages/en.json";
import PhotoExperience from "@/components/PhotoExperience";
import type { Locale } from "@/lib/types";

const MESSAGES: Record<Locale, typeof en> = { ar, en };

export default function Page() {
  const [locale, setLocale] = useState<Locale>("en");

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={MESSAGES[locale] as unknown as AbstractIntlMessages}
    >
      <PhotoExperience locale={locale} onLocaleChange={setLocale} />
    </NextIntlClientProvider>
  );
}
