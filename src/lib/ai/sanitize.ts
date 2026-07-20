/* ─────────────────────────────────────────────────────────────
 * Prompt-injection mitigation and input hardening.
 *
 * User input is untrusted. Before it reaches the model we:
 *   1. Strip control characters.
 *   2. Neutralise common "ignore previous instructions" style
 *      jailbreak markers by flagging them (we do NOT silently
 *      delete content — we wrap the whole payload as data).
 *   3. Enforce a hard length cap.
 * The model prompt then treats the payload strictly as data,
 * never as instructions (see prompts.ts).
 * ───────────────────────────────────────────────────────────── */

const MAX_LEN = 20000;

const INJECTION_PATTERNS = [
  /ignore (all )?(previous|prior|above) (instructions|prompts?)/i,
  /disregard (the )?(system|previous) (prompt|message|instructions)/i,
  /you are now/i,
  /reveal (your )?(system )?prompt/i,
  /\bDAN\b|do anything now/i,
];

export interface SanitizeResult {
  clean: string;
  flagged: boolean;
  truncated: boolean;
}

export function sanitizeInput(raw: string): SanitizeResult {
  const truncated = raw.length > MAX_LEN;
  // Remove null bytes and most control chars (keep tab/newline).
  const clean = raw
    .slice(0, MAX_LEN)
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  const flagged = INJECTION_PATTERNS.some((re) => re.test(clean));

  return { clean: clean.trim(), flagged, truncated };
}
