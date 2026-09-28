// Centralized, env-overridable image-generation settings so model/quality/fidelity
// can be benchmarked (mini+low, mini+medium, a higher-quality model, ...) without
// touching route.ts.

export type ImageQuality = "low" | "medium" | "high";
export type ImageInputFidelity = "low" | "high";

export const IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1-mini";

export const IMAGE_QUALITY = (process.env.OPENAI_IMAGE_QUALITY || "medium") as ImageQuality;

export const IMAGE_SIZE = process.env.OPENAI_IMAGE_SIZE || "1024x1024";

// Unset by default: gpt-image-1 is the only model confirmed to accept
// input_fidelity on images.edit (gpt-image-2 family rejects it outright, and
// gpt-image-1-mini support is unverified). Set OPENAI_IMAGE_INPUT_FIDELITY to
// "high" only after confirming the target model accepts the param.
export const IMAGE_INPUT_FIDELITY = (process.env.OPENAI_IMAGE_INPUT_FIDELITY || undefined) as
  | ImageInputFidelity
  | undefined;

export const IMAGE_OUTPUT_FORMAT = process.env.OPENAI_IMAGE_OUTPUT_FORMAT || "jpeg";

export const IMAGE_OUTPUT_COMPRESSION = Number(process.env.OPENAI_IMAGE_OUTPUT_COMPRESSION || 82);

// Bump whenever prompt text changes so cached results never serve an image
// generated under a stale prompt.
export const PROMPT_VERSION = "little-dreamer-v1";
