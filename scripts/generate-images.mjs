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
  {
    name: "security",
    size: "landscape_4_3",
    prompt: `A warm, calm study with a wooden desk, a small closed keepsake box and framed family photos, soft safe atmosphere of trust and care, ${STYLE}`,
  },
  {
    name: "generations",
    size: "landscape_4_3",
    prompt: `A grandmother, her adult daughter and a young grandchild laughing together on a cosy sofa at home, three generations connected, ${STYLE}`,
  },
  {
    name: "writing",
    size: "landscape_4_3",
    prompt: `Close-up of an older person's hands writing a heartfelt letter with a pen at a wooden table by a window, ${STYLE}`,
  },
  {
    name: "plek-toen",
    size: "portrait_4_3",
    prompt: `A vintage sepia-toned 1960s family photograph with aged film grain and soft faded tones, of a happy young woman about twenty years old in a summer dress standing on a windswept Dutch North Sea beach with grassy dunes and a wooden pier behind her, nostalgic, authentic old snapshot, absolutely no text or logos`,
  },
  {
    name: "plek-nu",
    size: "portrait_4_3",
    prompt: `A young woman in her late twenties standing on the same windswept Dutch North Sea beach today, holding up a smartphone to compare an old photograph with the view of the dunes and pier in front of her, tender and moved, ${STYLE}`,
  },
];

const only = process.argv.slice(2);
const selected = only.length ? IMAGES.filter((i) => only.includes(i.name)) : IMAGES;

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

for (const img of selected) {
  try {
    await gen(img);
  } catch (e) {
    console.log("ERROR", img.name, e.message);
  }
}
console.log("Klaar. Afbeeldingen in public/marketing/.");
