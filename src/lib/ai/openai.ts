import OpenAI from "openai";
import type { GenerateRequest, GenerationResult } from "@/types";
import { buildSystemPrompt, buildUserPrompt, IMPROVE_SYSTEM_PROMPT } from "./prompts";
import { generateMockProject } from "./mock";
import { analyzeSchema } from "./analyze";

const apiKey = process.env.OPENAI_API_KEY?.trim();
const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";

export function isAiConfigured(): boolean {
  return Boolean(apiKey);
}

let client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!client) client = new OpenAI({ apiKey });
  return client;
}

/** Pull the first top-level JSON object out of a model response. */
function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object found in model output");
  return candidate.slice(start, end + 1);
}

/**
 * Generate a backend project. Uses the OpenAI Responses API when an
 * API key is configured, otherwise falls back to the deterministic
 * mock so the product is fully usable offline.
 */
export async function generateProject(req: GenerateRequest): Promise<GenerationResult> {
  if (!isAiConfigured()) {
    return generateMockProject(req);
  }

  try {
    const openai = getClient();
    const response = await openai.responses.create({
      model,
      input: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: buildUserPrompt(req) },
      ],
      // Ask the API for JSON; we still defensively parse below.
      text: { format: { type: "json_object" } },
      max_output_tokens: 16000,
    });

    const outputText = response.output_text ?? "";
    const parsed = JSON.parse(extractJson(outputText)) as Partial<GenerationResult>;

    // Merge with a local analysis to guarantee the analysis panel is populated.
    const analysis = parsed.analysis ?? analyzeSchema(req.input, req.schemaType);
    const { input, ...options } = req;
    void input;

    return {
      summary: parsed.summary ?? "Generated backend project.",
      architecture: parsed.architecture ?? "",
      analysis,
      files: parsed.files ?? [],
      endpoints: parsed.endpoints ?? [],
      readme: parsed.readme ?? "",
      explanation: parsed.explanation ?? "",
      meta: {
        model,
        mock: false,
        generatedAt: new Date().toISOString(),
        options,
      },
    };
  } catch (err) {
    // Any API/parse failure gracefully degrades to the mock so the
    // user always gets a usable result. The route surfaces a notice.
    const fallback = generateMockProject(req);
    fallback.summary = `⚠️ AI request failed (${
      err instanceof Error ? err.message : "unknown error"
    }). Showing a locally generated project instead.\n\n${fallback.summary}`;
    return fallback;
  }
}

/** Improve a rough prompt into a detailed backend specification. */
export async function improvePrompt(input: string): Promise<string> {
  if (!isAiConfigured()) {
    return improvePromptLocally(input);
  }
  try {
    const openai = getClient();
    const response = await openai.responses.create({
      model,
      input: [
        { role: "system", content: IMPROVE_SYSTEM_PROMPT },
        { role: "user", content: input },
      ],
      max_output_tokens: 1200,
    });
    return response.output_text?.trim() || improvePromptLocally(input);
  } catch {
    return improvePromptLocally(input);
  }
}

/** Deterministic prompt enrichment used in mock mode. */
function improvePromptLocally(input: string): string {
  const trimmed = input.trim().replace(/\.$/, "");
  return `${trimmed}.

Please generate a production-ready REST backend with:
- Clear entities and fields with appropriate data types and sensible defaults.
- Well-defined relationships (one-to-many / many-to-many) with foreign keys.
- User authentication (register, login, JWT-protected routes) and role-based access where relevant.
- Full CRUD for every entity, plus pagination, filtering, sorting and search on list endpoints.
- Input validation on all write operations and consistent error responses.
- Seed data and a comprehensive README with setup instructions.`;
}
