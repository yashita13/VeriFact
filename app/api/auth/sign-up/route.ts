import { NextResponse } from "next/server";
import { db } from "@/firebase/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uid, name, email } = body || {};

    if (!uid || !email) {
      return new Response(JSON.stringify({ success: false, message: "Missing uid or email." }), { status: 400, headers: { "content-type": "application/json" } });
    }

    // Write user profile to Firestore (idempotent create if not exists)
    const ref = db.collection("users").doc(uid);
    const snap = await ref.get();
    if (!snap.exists) {
      await ref.set({ name: name || "", email });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "content-type": "application/json" } });
  } catch (e: any) {
    console.error("[api/auth/sign-up] error:", e);
    return new Response(JSON.stringify({ success: false, message: "Failed to create user profile." }), { status: 500, headers: { "content-type": "application/json" } });
  }
}
