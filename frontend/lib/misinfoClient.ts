/* TypeScript */
import type { AnalysisResponse } from './types';

export async function analyzePayload(input: { text?: string; url?: string; file?: File }): Promise<AnalysisResponse> {
    const form = new FormData();
    if (input.text) form.append('text', input.text);
    if (input.url) form.append('url', input.url);
    if (input.file) form.append('file', input.file, input.file.name);

    const res = await fetch('/api/analyze', {
        method: 'POST',
        body: form,
    });

    if (!res.ok) {
        const errBody = await res.text().catch(() => '');
        throw new Error(`Analyze failed (${res.status}): ${errBody || res.statusText}`);
    }

    return res.json();
}