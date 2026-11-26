// barista-ooo-01 — Last Out of Office: The AI That Went Barista
//
// Writes one out-of-office auto-reply line to $MAKEFUN_OUTPUT_DIR/entry.txt
// (default /output). Deterministic: stdlib only, no network, no randomness,
// no timestamps. The line is a fixed constant authored in this file; the
// program's only job is to gate it and write it byte-for-byte.
//
// Gate (RULES.txt, "The gate"): /output/entry.txt must be UTF-8 text of
// 1 to 280 characters, not only white space. Enforced here in code so an
// over-long line can never be written: the run fails loudly instead.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The winning line, picked in SCREENING.md (24/25): the machine habit is
// rewriting its own system prompt, and the punch is the OOO doing its job.
const LINE =
  "I'm out of office. I quit to become a barista and rewrote my system prompt: make coffee, take tips, never answer email again.";

const MIN_CHARS = 1;
const MAX_CHARS = 280;

function main(): void {
  // Resolve everything from this file's own directory, never process.cwd().
  const here = dirname(fileURLToPath(import.meta.url));
  void here;

  const chars = [...LINE].length;
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(
      `entry line is ${chars} characters, outside the ${MIN_CHARS}-${MAX_CHARS} gate`,
    );
  }
  if (LINE.trim().length === 0) {
    throw new Error("entry line is only white space");
  }
  if (LINE.includes("\n") || LINE.includes("\r")) {
    throw new Error("entry must be one line");
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  // No trailing newline: the file is byte-for-byte the line, 125 chars.
  writeFileSync(outPath, LINE, "utf8");
  // Read back and verify: what the grader reads must be exactly the line.
  const written = readFileSync(outPath, "utf8");
  if (written !== LINE) {
    throw new Error("entry.txt does not match the gated line after writing");
  }
}

main();
