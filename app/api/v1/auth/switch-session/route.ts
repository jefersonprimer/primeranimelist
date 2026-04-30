import { db } from "@/lib/db";
import { sessions } from "@/lib/db/schema";
import { setSessionCookie } from "@/lib/auth";
import { and, eq, gt } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  sessionToken: z.string().min(1, "sessionToken is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 },
      );
    }

    const { sessionToken } = parsed.data;
    const [session] = await db
      .select()
      .from(sessions)
      .where(
        and(eq(sessions.sessionToken, sessionToken), gt(sessions.expiresAt, new Date())),
      )
      .limit(1);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    await setSessionCookie(session.sessionToken, session.expiresAt);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to switch session" }, { status: 500 });
  }
}
