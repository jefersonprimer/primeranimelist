import { db } from "@/lib/db";
import { sessions, users } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import crypto from "crypto";

export const SESSION_COOKIE_NAME = "pa_session_token";
export const SESSION_EXPIRY_DAYS = 30;
export const SESSION_RENEW_THRESHOLD_DAYS = 15;

export interface SessionUser {
  id: number;
  email: string;
  fullName: string | null;
  username: string | null;
  profileImageUrl: string | null;
  backgroundImageUrl: string | null;
}

export interface SessionData {
  user: SessionUser;
  session: typeof sessions.$inferSelect;
}

// Simple in-memory cache for sessions to reduce DB hits
// Note: In serverless environments, this will only persist for the duration of the lambda's life
const sessionCache = new Map<string, { data: SessionData; expiry: number }>();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

export async function createSession(userId: number) {
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * SESSION_EXPIRY_DAYS);

  await db.insert(sessions).values({
    userId,
    sessionToken,
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return sessionToken;
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) return null;

  // Check cache first
  const cached = sessionCache.get(sessionToken);
  if (cached && cached.expiry > Date.now()) {
    return cached.data;
  }

  const result = await db
    .select({
      user: {
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        username: users.username,
        profileImageUrl: users.profileImageUrl,
        backgroundImageUrl: users.backgroundImageUrl,
      },
      session: sessions,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(
      and(
        eq(sessions.sessionToken, sessionToken),
        gt(sessions.expiresAt, new Date())
      )
    )
    .limit(1);

  if (result.length === 0) {
    sessionCache.delete(sessionToken);
    return null;
  }

  const sessionData = result[0];
  
  // Update cache
  sessionCache.set(sessionToken, {
    data: sessionData,
    expiry: Date.now() + CACHE_TTL,
  });

  // Extend session if it's close to expiring
  const now = new Date();
  const threshold = new Date(now.getTime() + 1000 * 60 * 60 * 24 * SESSION_RENEW_THRESHOLD_DAYS);
  
  if (sessionData.session.expiresAt < threshold) {
    const newExpiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 24 * SESSION_EXPIRY_DAYS);
    
    await db.update(sessions)
      .set({ expiresAt: newExpiresAt })
      .where(eq(sessions.id, sessionData.session.id));

    cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: newExpiresAt,
      path: "/",
    });
    
    // Update cache with new expiry in DB (optional, but keep data)
    sessionData.session.expiresAt = newExpiresAt;
    sessionCache.set(sessionToken, {
      data: sessionData,
      expiry: Date.now() + CACHE_TTL,
    });
  }

  return sessionData;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionToken) {
    sessionCache.delete(sessionToken);
    await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}
