import OpenAI from "openai";

// gpt-image-1 is currently the only model that supports input_fidelity on
// images.edit — gpt-image-2 and gpt-image-2.5-sunburst both reject it with
// "invalid_input_fidelity_model". Swap this constant if that changes.
export const OPENAI_IMAGE_MODEL = "gpt-image-1";

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
