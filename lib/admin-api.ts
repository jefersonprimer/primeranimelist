import { getSession } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function requireAdminApiUser() {
  const session = await getSession();
  if (!session) {
    return { ok: false as const, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (!isAdminEmail(session.user.email)) {
    return { ok: false as const, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true as const, session };
}

export function parseFiniteInt(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number.parseInt(String(value), 10);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

export function parseFiniteNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number.parseFloat(String(value));
  return Number.isFinite(n) ? n : null;
}

export function parseString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = typeof value === "string" ? value : String(value);
  const t = s.trim();
  return t.length ? t : null;
}

export function parseStringArrayField(value: unknown): string[] | null {
  if (value === null || value === undefined) return null;
  if (Array.isArray(value)) {
    const out = value.map((v) => String(v).trim()).filter((s) => s.length > 0);
    return out.length ? out : null;
  }
  if (typeof value === "string") {
    const out = value
      .split(/[,|]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    return out.length ? out : null;
  }
  return null;
}

export function parseBoolean(value: unknown): boolean | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "boolean") return value;
  if (value === "true" || value === 1 || value === "1") return true;
  if (value === "false" || value === 0 || value === "0") return false;
  return null;
}

export function parseIsoDate(value: unknown): Date | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string") return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}
