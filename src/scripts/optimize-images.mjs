import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const inputDir = "src/images/original";
const outputDir = "src/images/opt";

// mides típiques per responsive 
const widths = [480, 960, 1440];

async function fileSize(filePath) {
  const stat = await fs.stat(filePath);
  return stat.size;
}

await fs.mkdir(outputDir, { recursive: true });

const files = (await fs.readdir(inputDir))
  .filter(f => /\.(jpe?g|png)$/i.test(f));

const report = [];

for (const file of files) {
  const inPath = path.join(inputDir, file);
  const { name, ext } = path.parse(file);

  const beforeBytes = await fileSize(inPath);

  for (const w of widths) {
    const avifPath = path.join(outputDir, `${name}-${w}.avif`);
    const webpPath = path.join(outputDir, `${name}-${w}.webp`);

    await sharp(inPath)
      .resize({ width: w, withoutEnlargement: true })
      .avif({ quality: 50 })
      .toFile(avifPath);

    await sharp(inPath)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 70 })
      .toFile(webpPath);
  }

  // agafem com a “referència” la mida 960 per comparar fàcil
  const afterAvif = path.join(outputDir, `${name}-960.avif`);
  const afterWebp = path.join(outputDir, `${name}-960.webp`);

  const afterAvifBytes = await fileSize(afterAvif);
  const afterWebpBytes = await fileSize(afterWebp);

  report.push({
    image: file,
    beforeFormat: ext.replace(".", "").toLowerCase(),
    beforeBytes,
    afterFormatSample: "avif/webp",
    afterAvifBytes,
    afterWebpBytes,
  });
}

await fs.writeFile("image-report.json", JSON.stringify(report, null, 2), "utf8");

// --- ART DIRECTION: Berlin hero (imatge vertical) ---
// Generem dos crops diferents:
// 1) mobile: aspecte més vertical (4:5), focalitzat al centre
// 2) desktop: aspecte panoràmic (16:9), també al centre

const berlinInput = path.join(inputDir, "berlin-gos.jpg");

// Mobile crop (4:5)
await sharp(berlinInput)
  .resize({
    width: 960,
    height: 1200,
    fit: "cover",
    position: "attention"
  })
  .avif({ quality: 50 })
  .toFile(path.join(outputDir, "berlin-gos-mobile-960.avif"));

await sharp(berlinInput)
  .resize({
    width: 960,
    height: 1200,
    fit: "cover",
    position: "attention"
  })
  .webp({ quality: 70 })
  .toFile(path.join(outputDir, "berlin-gos-mobile-960.webp"));

// Desktop crop (16:9)
await sharp(berlinInput)
  .resize({
    width: 1440,
    height: 810,
    fit: "cover",
    position: "attention"
  })
  .avif({ quality: 50 })
  .toFile(path.join(outputDir, "berlin-gos-desktop-1440.avif"));

await sharp(berlinInput)
  .resize({
    width: 1440,
    height: 810,
    fit: "cover",
    position: "attention"
  })
  .webp({ quality: 70 })
  .toFile(path.join(outputDir, "berlin-gos-desktop-1440.webp"));

console.log("✅ Optimització feta. Mira src/images/opt/ i image-report.json");