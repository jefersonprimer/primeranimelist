import { getSession } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { user: null },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        },
      );
    }

    return NextResponse.json(
      {
        user: {
          ...session.user,
          sessionToken: session.session.sessionToken,
          isAdmin: isAdminEmail(session.user.email),
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
