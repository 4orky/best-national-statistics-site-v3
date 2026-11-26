// Japan in Numbers — entrypoint. Copies app/ and screenshots/ from this
// repository into the output directory and writes the dossier there with
// make.fun's frontend library. Standard library only, no network, no
// timestamps: two runs write the same bytes.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

function copyTree(src: string, dest: string): void {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
    const from = join(src, entry.name);
    const to = join(dest, entry.name);
    if (entry.isDirectory()) copyTree(from, to);
    else if (entry.isFile()) cpSync(from, to);
  }
}

if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
copyTree(join(repoRoot, "app"), join(outDir, "app"));
copyTree(join(repoRoot, "screenshots"), join(outDir, "screenshots"));

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
  app_path_max_bytes: 1000,
});
writeFileSync(join(outDir, "dossier.json"), dossier);
console.log("wrote " + outDir + "/dossier.json (" + dossier.length + " bytes)");
