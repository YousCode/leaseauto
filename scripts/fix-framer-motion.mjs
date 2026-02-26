import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";
import os from "node:os";

const cwd = process.cwd();
const packageJsonPath = join(cwd, "node_modules", "framer-motion", "package.json");
const motionDir = join(
  cwd,
  "node_modules",
  "framer-motion",
  "dist",
  "es",
  "render",
  "components",
  "motion",
);

const requiredFiles = ["create.mjs", "elements.mjs", "proxy.mjs"];
const missing = requiredFiles.filter((file) => !existsSync(join(motionDir, file)));

if (!existsSync(packageJsonPath) || missing.length === 0) {
  process.exit(0);
}

const fmVersion = JSON.parse(readFileSync(packageJsonPath, "utf8")).version;
const tmpDir = execSync("mktemp -d", { encoding: "utf8" }).trim() || os.tmpdir();
const pkgName = execSync(`npm pack framer-motion@${fmVersion} --silent`, {
  cwd: tmpDir,
  encoding: "utf8",
}).trim();

mkdirSync(motionDir, { recursive: true });

for (const file of missing) {
  const fileContent = execSync(
    `tar -xOf ${pkgName} package/dist/es/render/components/motion/${file}`,
    { cwd: tmpDir },
  );
  writeFileSync(join(motionDir, file), fileContent);
}

console.log(`[postinstall] framer-motion fixed (${missing.join(", ")})`);
