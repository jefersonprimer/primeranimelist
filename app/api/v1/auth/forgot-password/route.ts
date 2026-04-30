import { NextResponse } from "next/server";
import { and, eq, gt, isNull } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { passwordResetCodes, users } from "@/lib/db/schema";
import { ensureDatabase } from "@/lib/db/bootstrap";
import { sendPasswordResetCodeEmail } from "@/lib/email";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

function generateVerificationCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message ?? "Invalid request payload" },
        { status: 400 }
      );
    }

    const { email } = result.data;

    await ensureDatabase();

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      return NextResponse.json({
        message: "If this account exists, a reset code was sent to the email.",
      });
    }

    const now = new Date();

    const [activeCode] = await db
      .select()
      .from(passwordResetCodes)
      .where(
        and(
          eq(passwordResetCodes.userId, user.id),
          isNull(passwordResetCodes.usedAt),
          gt(passwordResetCodes.expiresAt, now)
        )
      )
      .limit(1);

    if (activeCode) {
      return NextResponse.json({
        message: "A valid code was already sent. Please check your email.",
      });
    }

    const verificationCode = generateVerificationCode();
    const codeHash = await bcrypt.hash(verificationCode, 10);
    const expiresAt = new Date(now.getTime() + 15 * 60 * 1000);

    await db.insert(passwordResetCodes).values({
      userId: user.id,
      codeHash,
      expiresAt,
    });

    await sendPasswordResetCodeEmail(user.email, verificationCode);

    return NextResponse.json({
      message: "If this account exists, a reset code was sent to the email.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing the request." },
      { status: 500 }
    );
  }
}
