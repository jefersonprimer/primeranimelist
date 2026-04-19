import { getSession } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        ...session.user,
        isAdmin: isAdminEmail(session.user.email),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
