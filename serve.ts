// Tiny static server for local testing: serves app/ at http://localhost:8080
// (or --port <n>). Nothing but the Node standard library; no build step.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(join(fileURLToPath(import.meta.url), "..", "app"));
const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};

const portFlag = process.argv.indexOf("--port");
const port = portFlag === -1 ? 8080 : Number(process.argv[portFlag + 1]) || 8080;

createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url || "/", "http://localhost").pathname);
    let file = normalize(join(root, path));
    if (!file.startsWith(root)) {
      res.writeHead(403);
      res.end("forbidden");
      return;
    }
    if (file.endsWith("/")) file = join(file, "index.html");
    if (file === root) file = join(root, "index.html");
    const body = await readFile(file);
    res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end("not found");
  }
}).listen(port, () => console.log("serving app/ at http://localhost:" + port));
