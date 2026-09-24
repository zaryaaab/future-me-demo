import { Anton, Cairo, Lalezar, Plus_Jakarta_Sans } from "next/font/google";

// Body copy — readable at small sizes.
export const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-arabic",
  display: "swap",
});

export const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-latin",
  display: "swap",
});

// Display — bold condensed headlines and buttons, game-poster feel.
export const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display-latin",
  display: "swap",
});

export const lalezar = Lalezar({
  subsets: ["arabic"],
  weight: "400",
  variable: "--font-display-arabic",
  display: "swap",
});
