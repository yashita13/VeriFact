/* TypeScript */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Decision = 'True' | 'False' | 'Misleading' | 'Unverifiable' | 'Error';
type WebResult = { title: string; url: string };
type ClaimBreakdown = {
    sub_claim: string;
    status: 'Supported' | 'Refuted' | 'Contradicted' | 'Unverifiable';
    evidence: string;
    source_url?: string;
    reason_for_decision: string;
};

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

function normalizeToAnalysisResponse(body: any) {
    // Try common locations for verdict fields
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

    // Explanation
    const expSrc = body?.explanation ?? body?.explainability ?? {};
    const claim_breakdown: ClaimBreakdown[] = Array.isArray(expSrc?.claim_breakdown)
        ? expSrc.claim_breakdown
        : [];

    const explanation: string | undefined =
        typeof expSrc?.explanation === 'string' ? expSrc.explanation
            : typeof body?.explanationText === 'string' ? body.explanationText
                : undefined;

    const explanatory_tag: string | undefined = expSrc?.explanatory_tag || body?.explanatory_tag;
    const corrected_news: string | undefined = expSrc?.corrected_news || body?.corrected_news;
    const misinformation_techniques: string[] | undefined = Array.isArray(expSrc?.misinformation_techniques)
        ? expSrc.misinformation_techniques
        : undefined;

    // Summary
    const summary: string | undefined =
        typeof body?.summary === 'string' ? body.summary
            : typeof body?.concise_news === 'string' ? body.concise_news
                : typeof body?.generated_summary === 'string' ? body.generated_summary
                    : undefined;

    // Web sources
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

    // Error passthrough if present
    const error = body?.error;
    const detail = body?.detail;

    return {
        summary,
        final_verdict: {
            decision: decision ?? 'Unknown',
            fake_score: typeof fake_score === 'number' ? fake_score : undefined,
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
        const maybeFile = form.get('file');

        const isFile =
            typeof File !== 'undefined' &&
            maybeFile instanceof File &&
            (maybeFile as File).size > 0;

        let res: Response;

        if (isFile) {
            // Backend expects multipart with inputType=file
            const mf = new FormData();
            mf.append('inputType', 'file');
            mf.append('file', maybeFile as File);

            res = await fetch(`${backendUrl}/analyze`, {
                method: 'POST',
                body: mf,
            });
        } else {
            // Backend expects JSON { inputType, input }
            const payload: { inputType: 'text' | 'url'; input: string } | null =
                typeof text === 'string' && text.trim()
                    ? { inputType: 'text', input: text.trim() }
                    : typeof url === 'string' && url.trim()
                        ? { inputType: 'url', input: url.trim() }
                        : null;

            if (!payload) {
                return new Response(JSON.stringify({ error: 'No valid input provided' }), { status: 400 });
            }

            res = await fetch(`${backendUrl}/analyze`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(payload),
            });
        }

        const contentType = res.headers.get('content-type') || '';
        const raw = contentType.includes('application/json') ? await res.json() : await res.text();

        // If backend didn’t return JSON or returned an error status,
        // pass it through for debugging
        if (!res.ok) {
            return new Response(
                typeof raw === 'string' ? raw : JSON.stringify(raw),
                { status: res.status, headers: { 'content-type': contentType.includes('application/json') ? 'application/json' : 'text/plain' } }
            );
        }

        // Normalize to the shape the Results page expects
        const normalized = typeof raw === 'string' ? { error: raw } : normalizeToAnalysisResponse(raw);

        return new Response(JSON.stringify(normalized), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: 'Proxy error', detail: String(err?.message || err) }), { status: 500 });
    }
}