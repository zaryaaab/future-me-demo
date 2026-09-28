export type AdventureId = "space" | "dinosaur" | "scientist" | "chef";

export interface Adventure {
  id: AdventureId;
  label: { ar: string; en: string };
  icon: string;
  prompt: string;
  caption: { ar: string; en: string };
}

export const ADVENTURES: Record<AdventureId, Adventure> = {
  space: {
    id: "space",
    label: { ar: "مستكشف الفضاء", en: "Space Explorer" },
    icon: "🚀",
    prompt:
      "Change the outfit to an age-appropriate kid-sized astronaut suit (helmet off, face fully visible) and place them inside an impressive, colorful space-station environment with control panels, starfields, and Earth glowing through a large window. Bright, wondrous sci-fi lighting.",
    caption: { ar: "مستكشف الفضاء", en: "Space Explorer" },
  },
  dinosaur: {
    id: "dinosaur",
    label: { ar: "مستكشف الديناصورات", en: "Dinosaur Explorer" },
    icon: "🦕",
    prompt:
      "Change the outfit to a young explorer's adventure outfit (vest, cap) and place them in a lush, colorful prehistoric jungle with friendly, non-threatening dinosaurs nearby. Warm, adventurous daylight.",
    caption: { ar: "مستكشف الديناصورات", en: "Dinosaur Explorer" },
  },
  scientist: {
    id: "scientist",
    label: { ar: "عالم صغير", en: "Junior Scientist" },
    icon: "🔬",
    prompt:
      "Change the outfit to an age-appropriate kid-sized lab coat with safety goggles, and place them in a bright, modern lab with colorful bubbling beakers and fun experiment elements. Clean, cheerful lighting.",
    caption: { ar: "عالم صغير", en: "Junior Scientist" },
  },
  chef: {
    id: "chef",
    label: { ar: "شيف صغير", en: "Little Chef" },
    icon: "👨‍🍳",
    prompt:
      "Change the outfit to a kid-sized chef's jacket and toque, and place them in a warm, colorful professional kitchen decorating a fun dessert. Warm, appetizing kitchen lighting.",
    caption: { ar: "شيف صغير", en: "Little Chef" },
  },
};

export function getAdventure(adventureId: string): Adventure | undefined {
  return ADVENTURES[adventureId as AdventureId];
}
