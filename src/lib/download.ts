"use client";

import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { GeneratedFile } from "@/types";

/** Download all generated files as a single ZIP archive. */
export async function downloadZip(files: GeneratedFile[], name = "generated-backend") {
  const zip = new JSZip();
  const root = zip.folder(name)!;
  for (const file of files) {
    root.file(file.path, file.code);
  }
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${name}.zip`);
}

/** Download a single file. */
export function downloadFile(file: GeneratedFile) {
  const blob = new Blob([file.code], { type: "text/plain;charset=utf-8" });
  saveAs(blob, file.path.split("/").pop() || "file.txt");
}

/** Copy text to the clipboard, returning success. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Concatenate every file into one copyable blob of text. */
export function concatFiles(files: GeneratedFile[]): string {
  return files
    .map((f) => `// ===== ${f.path} =====\n${f.code}`)
    .join("\n\n");
}
