import type { SchemaAnalysis, SchemaEntity, SchemaType } from "@/types";

/* ─────────────────────────────────────────────────────────────
 * Lightweight, dependency-free schema analyzer.
 *
 * This performs a best-effort static extraction of entities,
 * fields, relationships, enums and indexes from the four
 * supported input formats. It powers:
 *   • the "Analyze schema" step shown to the user, and
 *   • the deterministic mock generator (so the offline demo
 *     produces output tailored to the actual input).
 *
 * It is intentionally forgiving — when it cannot confidently
 * parse structure (e.g. plain English) it falls back to
 * keyword-derived entities.
 * ───────────────────────────────────────────────────────────── */

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "for", "with", "build", "create",
  "generate", "make", "backend", "api", "system", "app", "application",
  "management", "please", "that", "this", "can", "should", "need",
  "want", "using", "based", "simple", "full", "complete",
]);

function toPascal(word: string): string {
  const clean = word.replace(/[^a-zA-Z0-9]/g, "");
  return clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
}

function singular(word: string): string {
  if (word.endsWith("ies")) return word.slice(0, -3) + "y";
  if (word.endsWith("ses")) return word.slice(0, -2);
  if (word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

function analyzeSql(input: string): SchemaAnalysis {
  const entities: SchemaEntity[] = [];
  const relationships: string[] = [];
  const enums: string[] = [];
  const indexes: string[] = [];

  const tableRegex = /create\s+table\s+["`]?(\w+)["`]?\s*\(([\s\S]*?)\);/gi;
  let match: RegExpExecArray | null;
  while ((match = tableRegex.exec(input)) !== null) {
    const [, tableName, body] = match;
    const fields: SchemaEntity["fields"] = [];
    let primaryKey: string | undefined;
    const relations: string[] = [];

    for (const rawLine of body.split(/,(?![^(]*\))/)) {
      const line = rawLine.trim();
      if (!line) continue;
      const lower = line.toLowerCase();
      if (lower.startsWith("primary key")) {
        const pk = line.match(/\(([^)]+)\)/);
        if (pk) primaryKey = pk[1].split(",")[0].trim().replace(/["`]/g, "");
        continue;
      }
      if (lower.startsWith("foreign key") || lower.includes("references")) {
        const ref = line.match(/references\s+["`]?(\w+)/i);
        if (ref) relations.push(toPascal(singular(ref[1])));
        continue;
      }
      if (lower.startsWith("index") || lower.startsWith("unique")) continue;
      const col = line.match(/^["`]?(\w+)["`]?\s+([a-zA-Z]+)/);
      if (col) {
        const [, name, type] = col;
        if (/serial|identity/i.test(line) || lower.includes("primary key")) {
          primaryKey = primaryKey ?? name;
        }
        fields.push({ name, type: type.toUpperCase() });
      }
    }

    entities.push({
      name: toPascal(singular(tableName)),
      fields,
      primaryKey: primaryKey ?? "id",
      relations,
    });
    relations.forEach((r) =>
      relationships.push(`${toPascal(singular(tableName))} → ${r}`)
    );
  }

  const enumRegex = /create\s+type\s+["`]?(\w+)["`]?\s+as\s+enum/gi;
  while ((match = enumRegex.exec(input)) !== null) enums.push(match[1]);

  const indexRegex = /create\s+(?:unique\s+)?index\s+["`]?(\w+)/gi;
  while ((match = indexRegex.exec(input)) !== null) indexes.push(match[1]);

  return { entities, relationships, enums, indexes };
}

function analyzePrisma(input: string): SchemaAnalysis {
  const entities: SchemaEntity[] = [];
  const relationships: string[] = [];
  const enums: string[] = [];
  const indexes: string[] = [];

  const modelRegex = /model\s+(\w+)\s*\{([\s\S]*?)\}/g;
  let match: RegExpExecArray | null;
  while ((match = modelRegex.exec(input)) !== null) {
    const [, name, body] = match;
    const fields: SchemaEntity["fields"] = [];
    let primaryKey: string | undefined;
    const relations: string[] = [];

    for (const rawLine of body.split("\n")) {
      const line = rawLine.trim();
      if (!line || line.startsWith("//") || line.startsWith("@@")) {
        if (line.startsWith("@@index")) indexes.push(`${name} index`);
        continue;
      }
      const parts = line.split(/\s+/);
      const [fieldName, fieldType] = parts;
      if (!fieldName || !fieldType) continue;
      if (line.includes("@id")) primaryKey = fieldName;
      const baseType = fieldType.replace(/[[\]?]/g, "");
      // A relation is a field whose type references another model.
      if (/^[A-Z]/.test(baseType) && line.includes("@relation")) {
        relations.push(baseType);
        relationships.push(`${name} → ${baseType}`);
      }
      fields.push({ name: fieldName, type: fieldType });
    }
    entities.push({ name, fields, primaryKey: primaryKey ?? "id", relations });
  }

  const enumRegex = /enum\s+(\w+)\s*\{/g;
  while ((match = enumRegex.exec(input)) !== null) enums.push(match[1]);

  return { entities, relationships, enums, indexes };
}

function analyzeMongoose(input: string): SchemaAnalysis {
  const entities: SchemaEntity[] = [];
  const relationships: string[] = [];
  const enums: string[] = [];
  const indexes: string[] = [];

  const schemaRegex =
    /(?:new\s+(?:mongoose\.)?Schema|Schema)\s*\(\s*\{([\s\S]*?)\}\s*(?:,|\))/g;
  const nameRegex = /(?:const|let|var)\s+(\w+)Schema\s*=/g;
  const names: string[] = [];
  let nm: RegExpExecArray | null;
  while ((nm = nameRegex.exec(input)) !== null) names.push(nm[1]);

  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = schemaRegex.exec(input)) !== null) {
    const body = match[1];
    const name = toPascal(names[i] ?? `Model${i + 1}`);
    i++;
    const fields: SchemaEntity["fields"] = [];
    const relations: string[] = [];
    const fieldRegex = /(\w+)\s*:\s*\{?\s*(?:type\s*:\s*)?([A-Za-z.]+)/g;
    let fm: RegExpExecArray | null;
    while ((fm = fieldRegex.exec(body)) !== null) {
      const [, fname, ftype] = fm;
      if (fname === "type") continue;
      fields.push({ name: fname, type: ftype });
      if (ftype.includes("ObjectId")) {
        const ref = body.match(
          new RegExp(`${fname}[\\s\\S]*?ref\\s*:\\s*['"](\\w+)['"]`)
        );
        if (ref) {
          relations.push(toPascal(ref[1]));
          relationships.push(`${name} → ${toPascal(ref[1])}`);
        }
      }
      if (body.includes("enum")) {
        const en = body.match(new RegExp(`${fname}[\\s\\S]*?enum\\s*:`));
        if (en && !enums.includes(fname)) enums.push(fname);
      }
    }
    entities.push({ name, fields, primaryKey: "_id", relations });
  }

  return { entities, relationships, enums, indexes };
}

function analyzeEnglish(input: string): SchemaAnalysis {
  // Derive candidate entities from capitalised nouns and common
  // domain keywords in the description.
  const words = input
    .replace(/[^a-zA-Z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w.toLowerCase()));

  const domainMap: Record<string, string[]> = {
    "e-commerce": ["User", "Product", "Category", "Order", "Cart", "Payment"],
    ecommerce: ["User", "Product", "Category", "Order", "Cart", "Payment"],
    shop: ["User", "Product", "Category", "Order", "Cart"],
    blog: ["User", "Post", "Comment", "Category", "Tag"],
    crm: ["User", "Contact", "Company", "Deal", "Activity"],
    erp: ["User", "Employee", "Department", "Product", "Invoice", "Order"],
    hospital: ["Patient", "Doctor", "Appointment", "Department", "Prescription"],
    school: ["Student", "Teacher", "Course", "Class", "Grade"],
    inventory: ["Product", "Warehouse", "Stock", "Supplier", "Order"],
    restaurant: ["MenuItem", "Order", "Table", "Reservation", "Customer"],
    finance: ["User", "Account", "Transaction", "Budget", "Category"],
    task: ["User", "Project", "Task", "Comment", "Label"],
    hrms: ["Employee", "Department", "Leave", "Payroll", "Attendance"],
  };

  const lower = input.toLowerCase();
  let names: string[] | undefined;
  for (const key of Object.keys(domainMap)) {
    if (lower.includes(key)) {
      names = domainMap[key];
      break;
    }
  }

  if (!names) {
    const uniq = Array.from(new Set(words.map((w) => toPascal(singular(w)))));
    names = uniq.slice(0, 5);
    if (!names.includes("User")) names.unshift("User");
  }

  const entities: SchemaEntity[] = names.map((name) => ({
    name,
    fields: [
      { name: "id", type: "ID" },
      { name: "name", type: "String" },
      { name: "createdAt", type: "DateTime" },
      { name: "updatedAt", type: "DateTime" },
    ],
    primaryKey: "id",
    relations: [],
  }));

  const relationships: string[] = [];
  for (let i = 1; i < entities.length; i++) {
    if (entities[0]) {
      entities[i].relations = [entities[0].name];
      relationships.push(`${entities[i].name} → ${entities[0].name}`);
    }
  }

  return { entities, relationships, enums: [], indexes: [] };
}

export function analyzeSchema(
  input: string,
  type: SchemaType
): SchemaAnalysis {
  try {
    switch (type) {
      case "sql":
        return analyzeSql(input);
      case "prisma":
        return analyzePrisma(input);
      case "mongoose":
        return analyzeMongoose(input);
      case "english":
      default:
        return analyzeEnglish(input);
    }
  } catch {
    return { entities: [], relationships: [], enums: [], indexes: [] };
  }
}
