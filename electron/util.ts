import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

export function getAssetPath(assetName: string): string {
  return path.join(isDev() ? __dirname : process.resourcesPath, "assets", assetName);
}
