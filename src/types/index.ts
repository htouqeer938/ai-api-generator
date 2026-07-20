/* ─────────────────────────────────────────────────────────────
 * Shared domain types for the AI API Generator.
 * ───────────────────────────────────────────────────────────── */

export type DatabaseType = "postgresql" | "mysql" | "sqlite" | "mongodb";
export type SchemaType = "sql" | "prisma" | "mongoose" | "english";
export type Framework = "express" | "nextjs" | "nestjs";
export type OutputLanguage = "javascript" | "typescript";

export interface GenerationOptions {
  database: DatabaseType;
  schemaType: SchemaType;
  framework: Framework;
  language: OutputLanguage;
  auth: {
    jwt: boolean;
    refreshToken: boolean;
  };
  validation: {
    zod: boolean;
    joi: boolean;
  };
  documentation: {
    swagger: boolean;
    openapi: boolean;
  };
}

export interface GenerateRequest extends GenerationOptions {
  input: string;
}

/** A single generated source file. */
export interface GeneratedFile {
  path: string;
  code: string;
  language?: string;
}

/** Extracted schema entity for the analysis step. */
export interface SchemaEntity {
  name: string;
  fields: { name: string; type: string; note?: string }[];
  primaryKey?: string;
  relations?: string[];
}

export interface SchemaAnalysis {
  entities: SchemaEntity[];
  relationships: string[];
  enums: string[];
  indexes: string[];
}

export interface SwaggerEndpoint {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  summary: string;
  auth: boolean;
  tag: string;
}

/** The structured response returned by the AI generator. */
export interface GenerationResult {
  summary: string;
  architecture: string;
  analysis: SchemaAnalysis;
  files: GeneratedFile[];
  endpoints: SwaggerEndpoint[];
  readme: string;
  explanation: string;
  meta: {
    model: string;
    mock: boolean;
    generatedAt: string;
    options: GenerationOptions;
  };
}

/** Locally persisted history record. */
export interface HistoryRecord {
  id: string;
  title: string;
  createdAt: string;
  database: DatabaseType;
  framework: Framework;
  input: string;
  result: GenerationResult;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}
