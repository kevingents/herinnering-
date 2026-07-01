// Generate warm, on-brand marketing images via fal.ai (FLUX) → public/marketing/.
// Usage: set FAL_API_KEY in .env.local, then: node scripts/generate-images.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { config } from "dotenv";

config({ path: ".env.local" });
config();

const KEY = process.env.FAL_API_KEY || process.env.FAL_KEY;
if (!KEY) {
  console.error("FAL_API_KEY ontbreekt in .env.local");
  process.exit(1);
}

const MODEL = "fal-ai/flux/dev";
const STYLE =
  "warm natural golden afternoon light, soft, tender, candid, cinematic, shallow depth of field, film photography, muted cream and sage tones, cozy, authentic, absolutely no text or logos";

const IMAGES = [
  {
    name: "hero",
    size: "landscape_4_3",
    prompt: `A multigenerational family — grandparents, parents and a young child — sitting together at a wooden table looking through an old photo album and loose photographs, a warm home interior with plants, everyone gently smiling, ${STYLE}`,
  },
  {
    name: "portrait-1",
    size: "square_hd",
    prompt: `Candid portrait of a warm smiling elderly woman with silver hair in a cozy living room, ${STYLE}`,
  },
  {
    name: "portrait-2",
    size: "square_hd",
    prompt: `Candid portrait of a gentle elderly man laughing softly, warm home background, ${STYLE}`,
  },
  {
    name: "portrait-3",
    size: "square_hd",
    prompt: `Candid portrait of a middle-aged woman holding an old framed photograph, moved and grateful, ${STYLE}`,
  },
  {
    name: "partner",
    size: "landscape_4_3",
    prompt: `A calm, tasteful, respectful consultation: a caring funeral director talking softly with a family across a wooden desk in a serene, light room with flowers, ${STYLE}`,
  },
  {
    name: "keepsake",
    size: "landscape_4_3",
    prompt: `Close-up of hands opening a wooden keepsake box filled with old photographs, letters and small mementos on a table, ${STYLE}`,
  },
];

const OUT = "public/marketing";
mkdirSync(OUT, { recursive: true });

async function gen({ name, prompt, size }) {
  process.stdout.write(`→ ${name}… `);
  const res = await fetch(`https://fal.run/${MODEL}`, {
    method: "POST",
    headers: { Authorization: `Key ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      image_size: size,
      num_images: 1,
      enable_safety_checker: true,
      output_format: "jpeg",
    }),
  });
  if (!res.ok) {
    console.log("FAIL", res.status, (await res.text()).slice(0, 200));
    return;
  }
  const data = await res.json();
  const url = data?.images?.[0]?.url;
  if (!url) {
    console.log("FAIL no image url");
    return;
  }
  const bin = Buffer.from(await (await fetch(url)).arrayBuffer());
  writeFileSync(`${OUT}/${name}.jpg`, bin);
  console.log(`OK (${Math.round(bin.length / 1024)} kB)`);
}

for (const img of IMAGES) {
  try {
    await gen(img);
  } catch (e) {
    console.log("ERROR", img.name, e.message);
  }
}
console.log("Klaar. Afbeeldingen in public/marketing/.");
