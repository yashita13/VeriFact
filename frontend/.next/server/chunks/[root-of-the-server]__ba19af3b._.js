module.exports = {

"[project]/.next-internal/server/app/api/auth/sign-up/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}}),
"[externals]/firebase-admin [external] (firebase-admin, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("firebase-admin", () => require("firebase-admin"));

module.exports = mod;
}}),
"[project]/firebase/admin.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "auth": ()=>auth,
    "db": ()=>db
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/firebase-admin [external] (firebase-admin, cjs)");
;
// We guard against re-initialization in Next.js dev
const apps = __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["apps"];
if (!apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    if (privateKey && privateKey.includes("\\n")) {
        privateKey = privateKey.replace(/\\n/g, "\n");
    }
    if (!projectId || !clientEmail || !privateKey) {
        console.warn('[firebase-admin] Missing admin credentials. Make sure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set.');
    } else {
        __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["initializeApp"]({
            credential: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["credential"].cert({
                projectId,
                clientEmail,
                privateKey
            })
        });
    }
}
const auth = __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["auth"]();
const db = __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["firestore"]();
}),
"[project]/app/api/auth/sign-up/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "POST": ()=>POST
});
var __TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/firebase/admin.ts [app-route] (ecmascript)");
;
async function POST(req) {
    try {
        const body = await req.json();
        const { uid, name, email } = body || {};
        if (!uid || !email) {
            return new Response(JSON.stringify({
                success: false,
                message: "Missing uid or email."
            }), {
                status: 400,
                headers: {
                    "content-type": "application/json"
                }
            });
        }
        // Write user profile to Firestore (idempotent create if not exists)
        const ref = __TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection("users").doc(uid);
        const snap = await ref.get();
        if (!snap.exists) {
            await ref.set({
                name: name || "",
                email
            });
        }
        return new Response(JSON.stringify({
            success: true
        }), {
            status: 200,
            headers: {
                "content-type": "application/json"
            }
        });
    } catch (e) {
        console.error("[api/auth/sign-up] error:", e);
        return new Response(JSON.stringify({
            success: false,
            message: "Failed to create user profile."
        }), {
            status: 500,
            headers: {
                "content-type": "application/json"
            }
        });
    }
}
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__ba19af3b._.js.map