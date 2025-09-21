/* TypeScript */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!backendUrl) {
            return new Response(JSON.stringify({ error: 'Backend URL not configured' }), { status: 500 });
        }

        const frontendFormData = await req.formData();
        const text = frontendFormData.get('text');
        const url = frontendFormData.get('url');
        const file = frontendFormData.get('file');

        let res: Response;

        // Check if the input is a file upload
        if (file instanceof File && file.size > 0) {
            // A file exists, so we send it as multipart/form-data to the /analyze-file endpoint
            const filePayload = new FormData();
            filePayload.append('file', file);

            res = await fetch(`${backendUrl}/analyze`, {
                method: 'POST',
                body: filePayload,
            });

        } else {
            // The input is text or a URL, so we send as application/json to the /analyze endpoint
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

        // Handle the response from the backend
        const body = await res.json();

        // If the backend returned an error status, forward it
        if (!res.ok) {
            const errorMessage = body.detail || body.error || 'Unknown backend error';
            return new Response(JSON.stringify({ error: errorMessage }), { status: res.status });
        }

        // If successful, forward the complete success response
        return new Response(JSON.stringify(body), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (err: any) {
        // Handle network errors or other issues with the proxy itself
        console.error("Proxy Error:", err);
        return new Response(JSON.stringify({ error: 'Proxy error', detail: String(err?.message || err) }), { status: 500 });
    }
}

