import { cookies } from "next/headers";
import { auth } from "@/firebase/admin";

const ONE_WEEK = 60 * 60 * 24 * 7; // seconds

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) {
      return new Response(JSON.stringify({ success: false, message: "Missing idToken." }), { status: 400, headers: { "content-type": "application/json" } });
    }

    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: ONE_WEEK * 1000 });

    // Build Set-Cookie header manually to avoid typing headaches
    const parts = [
      `session=${sessionCookie}`,
      `Max-Age=${ONE_WEEK}`,
      `Path=/`,
      `HttpOnly`,
      `SameSite=Lax`,
    ];
    if (process.env.NODE_ENV === "production") parts.push("Secure");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "set-cookie": parts.join("; "),
      },
    });
  } catch (e: any) {
    console.error("[api/auth/session] error:", e);
    return new Response(JSON.stringify({ success: false, message: "Failed to establish session." }), { status: 500, headers: { "content-type": "application/json" } });
  }
}
