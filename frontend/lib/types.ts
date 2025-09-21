/* TypeScript */
import type { AnalysisResponse, Decision, WebResult, ClaimBreakdown } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Helper function to safely interpret various "decision" strings from the backend
function coerceDecision(v: any): Decision | undefined {
    if (!v) return undefined;
    const s = String(v).toLowerCase();
    if (s.includes('true')) return 'True';
    if (s.includes('false')) return 'False';
    if (s.includes('misleading')) return 'Misleading';
    if (s.includes('unverifiable') || s.includes('uncertain')) return 'Unverifiable';
    if (s.includes('error')) return 'Error';
    return undefined;
}

// This function takes a raw object from the backend and safely transforms it
// into the strict AnalysisResponse shape that the frontend results page expects.
function normalizeToAnalysisResponse(body: any): AnalysisResponse {
    // Gracefully handle nested or flat verdict fields
    const fv = body?.final_verdict ?? {};
    const decision: Decision | undefined =
        coerceDecision(fv?.decision) ??
        coerceDecision(body?.decision) ??
        undefined;

    const fake_score: number | undefined =
        typeof fv?.fake_score === 'number' ? fv.fake_score
            : typeof body?.fake_score === 'number' ? body.fake_score
                : undefined;

    const reasoning: string | undefined =
        typeof fv?.reasoning === 'string' ? fv.reasoning
            : typeof body?.reasoning === 'string' ? body.reasoning
                : undefined;

    // Normalize the explanation section from various possible keys
    const expSrc = body?.explanation ?? body?.explainability ?? {};
    const claim_breakdown: ClaimBreakdown[] = Array.isArray(expSrc?.claim_breakdown)
        ? expSrc.claim_breakdown
        : [];

    const explanation: string | undefined =
        typeof expSrc?.explanation === 'string' ? expSrc.explanation
            : typeof body?.explanationText === 'string' ? body.explanationText
                : undefined;

    // Normalize various other metadata fields
    const explanatory_tag: string | undefined = expSrc?.explanatory_tag || body?.explanatory_tag;
    const corrected_news: string | undefined = expSrc?.corrected_news || body?.corrected_news;
    const misinformation_techniques: string[] | undefined = Array.isArray(expSrc?.misinformation_techniques)
        ? expSrc.misinformation_techniques
        : undefined;

    const summary: string | undefined =
        typeof body?.summary === 'string' ? body.summary
            : typeof body?.concise_news === 'string' ? body.concise_news
                : typeof body?.generated_summary === 'string' ? body.generated_summary
                    : undefined;

    // Normalize web sources, which can come in different formats
    let web_results: WebResult[] = [];
    if (Array.isArray(body?.web_results)) {
        web_results = body.web_results.map((w: any) => ({
            title: String(w?.title || w?.metadata?.title || w?.url || ''),
            url: String(w?.url || w?.metadata?.url || ''),
        })).filter((x: WebResult) => x.url);
    } else if (Array.isArray(body?.sources)) {
        web_results = body.sources.map((s: any) => ({
            title: String(s?.title || s?.url || ''),
            url: String(s?.url || ''),
        })).filter((x: WebResult) => x.url);
    }

    const fact_check_api = Array.isArray(body?.fact_check_api) ? body.fact_check_api : [];

    // Pass through any top-level errors from the backend
    const error = body?.error;
    const detail = body?.detail;

    // Assemble the final, clean object that matches the AnalysisResponse interface
    return {
        summary,
        final_verdict: {
            decision: decision ?? 'Error', // Default to 'Error' if no decision is found
            fake_score: fake_score,
            reasoning: reasoning ?? '',
        },
        explanation: {
            claim_breakdown,
            explanation: explanation ?? '',
            corrected_news: corrected_news ?? '',
            explanatory_tag: explanatory_tag ?? '',
            misinformation_techniques: misinformation_techniques ?? [],
        },
        web_results,
        fact_check_api,
        ...(error ? { error } : {}),
        ...(detail ? { detail } : {}),
    };
}

export async function POST(req: Request) {
    try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!backendUrl) {
            return new Response(JSON.stringify({ error: 'Backend URL not configured' }), { status: 500 });
        }

        const form = await req.formData();
        const text = form.get('text');
        const url = form.get('url');
        const file = form.get('file');

        let res: Response;

        // This logic correctly separates file uploads from text/URL submissions
        if (file instanceof File && file.size > 0) {
            const filePayload = new FormData();
            filePayload.append('file', file);
            res = await fetch(`${backendUrl}/analyze-file`, {
                method: 'POST',
                body: filePayload,
            });
        } else {
            // The request is for text or a URL, so we send as JSON
            const jsonPayload: { text?: string; url?: string; input_type: string } = {
                input_type: 'text' // Default
            };
            if (text && typeof text === 'string' && text.trim()) {
                jsonPayload.text = text.trim();
                jsonPayload.input_type = 'text';
            } else if (url && typeof url === 'string' && url.trim()) {
                jsonPayload.url = url.trim();
                jsonPayload.input_type = 'url';
            } else {
                return new Response(JSON.stringify({ error: 'No valid text or URL input provided' }), { status: 400 });
            }

            res = await fetch(`${backendUrl}/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jsonPayload),
            });
        }

        const rawBody = await res.json();

        if (!res.ok) {
            // If the backend returned an error, still try to normalize it for consistent error display
            const normalizedError = normalizeToAnalysisResponse(rawBody);
            return new Response(JSON.stringify(normalizedError), { status: res.status });
        }

        // Normalize the successful response to the shape the Results page expects
        const normalized = normalizeToAnalysisResponse(rawBody.results || rawBody);

        return new Response(JSON.stringify(normalized), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (err: any) {
        return new Response(JSON.stringify({ error: 'Proxy error', detail: String(err?.message || err) }), { status: 500 });
    }
}

