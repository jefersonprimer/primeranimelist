import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { createSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { ensureDatabase } from "@/lib/db/bootstrap";
import { isAdminEmail } from "@/lib/admin";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  fullName: z.string().min(2, "Full name must be at least 2 characters long").optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = signupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message ?? "Invalid request payload" },
        { status: 400 }
      );
    }

    const { email, password, fullName } = result.data;

    await ensureDatabase();

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12); // Increased salt rounds for better security

    const [newUser] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        fullName: fullName || null,
      })
      .returning();

    const sessionToken = await createSession(newUser.id);

    return NextResponse.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        username: newUser.username,
        profileImageUrl: newUser.profileImageUrl,
        backgroundImageUrl: newUser.backgroundImageUrl,
        sessionToken,
        isAdmin: isAdminEmail(newUser.email),
      },
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during signup" },
      { status: 500 }
    );
  }
}
