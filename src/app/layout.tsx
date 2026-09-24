import type { Metadata, Viewport } from "next";
import { anton, cairo, jakarta, lalezar } from "@/lib/fonts";
import { APP_TITLE } from "@/config/app";
import "./globals.css";

export const metadata: Metadata = {
  title: `${APP_TITLE.en} · ${APP_TITLE.ar}`,
  description: APP_TITLE.en,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0612",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body
        className={`${cairo.variable} ${jakarta.variable} ${anton.variable} ${lalezar.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
