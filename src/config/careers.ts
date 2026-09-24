export type CareerId = "astronaut" | "pilot" | "doctor" | "chef";

export interface Career {
  id: CareerId;
  label: { ar: string; en: string };
  icon: string;
  prompt: string;
  caption: { ar: string; en: string };
}

export const CAREERS: Record<CareerId, Career> = {
  astronaut: {
    id: "astronaut",
    label: { ar: "رائد فضاء", en: "Astronaut" },
    icon: "🧑‍🚀",
    prompt:
      "Change the person's clothing to a white spacesuit (helmet off, face fully visible) and place them inside a space station interior, with Earth visible through a large window behind them. Cinematic sci-fi lighting with cool highlights from the window light and warm interior fill.",
    caption: { ar: "رائد فضاء المستقبل", en: "Future Astronaut" },
  },
  pilot: {
    id: "pilot",
    label: { ar: "طيار", en: "Pilot" },
    icon: "🧑‍✈️",
    prompt:
      "Change the person's clothing to a pilot's uniform and seat them in an airliner cockpit, with a golden sunrise glowing over a sea of clouds through the cockpit windows. Warm golden-hour light filling the cabin.",
    caption: { ar: "طيار المستقبل", en: "Future Pilot" },
  },
  doctor: {
    id: "doctor",
    label: { ar: "طبيب", en: "Doctor" },
    icon: "🧑‍⚕️",
    prompt:
      "Change the person's clothing to a white doctor's coat with a stethoscope around their neck, and place them in a bright, modern hospital setting. Clean, soft, professional lighting.",
    caption: { ar: "طبيب المستقبل", en: "Future Doctor" },
  },
  chef: {
    id: "chef",
    label: { ar: "شيف", en: "Chef" },
    icon: "🧑‍🍳",
    prompt:
      "Change the person's clothing to a chef's jacket and toque, and place them in a professional kitchen while plating an elegant dish. Warm, appetizing kitchen lighting.",
    caption: { ar: "شيف المستقبل", en: "Future Chef" },
  },
};

export function getCareer(careerId: string): Career | undefined {
  return CAREERS[careerId as CareerId];
}
