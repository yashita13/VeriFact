module.exports = {

"[project]/.next-internal/server/app/api/analyze/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {

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
"[project]/app/api/analyze/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

/* TypeScript */ __turbopack_context__.s({
    "POST": ()=>POST,
    "dynamic": ()=>dynamic,
    "runtime": ()=>runtime
});
const runtime = 'nodejs';
const dynamic = 'force-dynamic';
async function POST(req) {
    try {
        const backendUrl = ("TURBOPACK compile-time value", "http://localhost:8000");
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const frontendFormData = await req.formData();
        const text = frontendFormData.get('text');
        const url = frontendFormData.get('url');
        const file = frontendFormData.get('file');
        let res;
        // Check if the input is a file upload
        if (file instanceof File && file.size > 0) {
            // A file exists, so we send it as multipart/form-data to the /analyze-file endpoint
            const filePayload = new FormData();
            filePayload.append('file', file);
            res = await fetch(`${backendUrl}/analyze`, {
                method: 'POST',
                body: filePayload
            });
        } else {
            // The input is text or a URL, so we send as application/json to the /analyze endpoint
            const jsonPayload = {
                input_type: 'text' // Default
            };
            if (text && typeof text === 'string' && text.trim()) {
                jsonPayload.text = text.trim();
                jsonPayload.input_type = 'text';
            } else if (url && typeof url === 'string' && url.trim()) {
                jsonPayload.url = url.trim();
                jsonPayload.input_type = 'url';
            } else {
                return new Response(JSON.stringify({
                    error: 'No valid text or URL input provided'
                }), {
                    status: 400
                });
            }
            res = await fetch(`${backendUrl}/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonPayload)
            });
        }
        // Handle the response from the backend
        const body = await res.json();
        // If the backend returned an error status, forward it
        if (!res.ok) {
            const errorMessage = body.detail || body.error || 'Unknown backend error';
            return new Response(JSON.stringify({
                error: errorMessage
            }), {
                status: res.status
            });
        }
        // If successful, forward the complete success response
        return new Response(JSON.stringify(body), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
        // Handle network errors or other issues with the proxy itself
        console.error("Proxy Error:", err);
        return new Response(JSON.stringify({
            error: 'Proxy error',
            detail: String(err?.message || err)
        }), {
            status: 500
        });
    }
}
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__eb7f232f._.js.map