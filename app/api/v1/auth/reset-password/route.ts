import { NextResponse } from "next/server";
import { and, desc, eq, gt, isNull } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { passwordResetCodes, users } from "@/lib/db/schema";
import { ensureDatabase } from "@/lib/db/bootstrap";

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().regex(/^\d{6}$/, "Code must be a 6-digit number"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = resetPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message ?? "Invalid request payload" },
        { status: 400 }
      );
    }

    const { email, code, password } = result.data;

    await ensureDatabase();

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      return NextResponse.json({ error: "Invalid email or code." }, { status: 400 });
    }

    const now = new Date();

    const [resetCode] = await db
      .select()
      .from(passwordResetCodes)
      .where(
        and(
          eq(passwordResetCodes.userId, user.id),
          isNull(passwordResetCodes.usedAt),
          gt(passwordResetCodes.expiresAt, now)
        )
      )
      .orderBy(desc(passwordResetCodes.createdAt))
      .limit(1);

    if (!resetCode) {
      return NextResponse.json(
        { error: "Code not found or expired. Request a new one." },
        { status: 400 }
      );
    }

    const codeMatches = await bcrypt.compare(code, resetCode.codeHash);

    if (!codeMatches) {
      return NextResponse.json({ error: "Invalid email or code." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await db.update(users).set({ passwordHash, updatedAt: now }).where(eq(users.id, user.id));
    await db.update(passwordResetCodes).set({ usedAt: now }).where(eq(passwordResetCodes.id, resetCode.id));

    return NextResponse.json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while resetting password." },
      { status: 500 }
    );
  }
}
