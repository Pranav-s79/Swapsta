import { NextResponse } from "next/server";
import { ZodError } from "zod";

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
  };
}

function fieldErrors(error: ZodError): Record<string, string[]> {
  const fields: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "request";
    fields[key] = [...(fields[key] ?? []), issue.message];
  }
  return fields;
}

export function validationError(error: ZodError): NextResponse<ApiErrorBody> {
  return NextResponse.json({
    error: { code: "VALIDATION_ERROR", message: "The request is invalid", fields: fieldErrors(error) },
  }, { status: 400 });
}

export function notFound(resource: string): NextResponse<ApiErrorBody> {
  return NextResponse.json({
    error: { code: "NOT_FOUND", message: `${resource} was not found` },
  }, { status: 404 });
}

export function invalidJson(): NextResponse<ApiErrorBody> {
  return NextResponse.json({
    error: { code: "INVALID_JSON", message: "The request body must contain valid JSON" },
  }, { status: 400 });
}
