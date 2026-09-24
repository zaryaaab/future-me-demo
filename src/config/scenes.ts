export type SceneId = "boulevard" | "cityNight" | "rooftop" | "speedboat";

export interface Scene {
  id: SceneId;
  prompt: string;
  caption: { en: string; ar: string };
}

export const BASE_PROMPT =
  "Turn the person in the photo into a stylized open-world crime-action video game cover art character: full body, confident pose, bold painted illustration style, crisp outlines, saturated sunset palette of pinks, oranges and purples, cinematic lighting, detailed scene. Keep the person's exact face, features, skin tone, hair and body type recognizable. Tasteful, no weapons, no violence, no text, no logos.";

export const SCENES: Scene[] = [
  {
    id: "boulevard",
    prompt:
      "Scene: leaning on a vintage convertible parked on a palm-lined ocean boulevard at sunset, pink and orange sky reflecting off the car's paintwork and the palm trees silhouetted along the road.",
    caption: { en: "Sunset Boulevard", ar: "شارع الغروب" },
  },
  {
    id: "cityNight",
    prompt:
      "Scene: walking down a neon-lit city street at night, glowing pink and purple signage reflected in the wet pavement around them.",
    caption: { en: "Neon Nights", ar: "أضواء النيون" },
  },
  {
    id: "rooftop",
    prompt:
      "Scene: standing on a rooftop high above a sprawling city skyline at golden hour, warm sunset light washing over the buildings behind them.",
    caption: { en: "Rooftop Skyline", ar: "أفق المدينة" },
  },
  {
    id: "speedboat",
    prompt:
      "Scene: aboard a speedboat cutting across the water at sunset, a glittering city skyline in the background.",
    caption: { en: "Sunset Run", ar: "جولة الغروب" },
  },
];

export function pickRandomScene(): Scene {
  return SCENES[Math.floor(Math.random() * SCENES.length)];
}

export function getScene(sceneId: string): Scene | undefined {
  return SCENES.find((s) => s.id === sceneId);
}
