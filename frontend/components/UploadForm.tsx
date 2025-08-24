"use client";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const ACCEPTED_IMAGE = ["image/png", "image/jpeg", "image/webp"];
const ACCEPTED_AUDIO = ["audio/mpeg", "audio/wav", "audio/mp4", "audio/aac", "audio/ogg"];
const ACCEPTED_VIDEO = ["video/mp4", "video/webm", "video/ogg"];

function humanFileType(file?: File | null) {
  if (!file) return "";
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type.startsWith("video/")) return "video";
  return "file";
}

export default function UploadForm() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const fileKind = useMemo(() => humanFileType(file), [file]);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  }

  function validate(): string | null {
    if (!text && !url && !file) {
      return "Please provide at least one input: Text, URL, or a media file.";
    }
    if (url && !/^https?:\/\//i.test(url)) {
      return "URL must start with http:// or https://";
    }
    if (file) {
      const t = file.type;
      const ok = [...ACCEPTED_IMAGE, ...ACCEPTED_AUDIO, ...ACCEPTED_VIDEO].includes(t);
      if (!ok) {
        return "Unsupported file type. Please upload image (png/jpg/webp), audio (mp3/wav/aac/ogg), or video (mp4/webm/ogg).";
      }
    }
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    // Minimal demo routing: pass metadata via query string (not the binary).
    // A real app would upload to storage/backend and return an ID.
    setSubmitting(true);
    try {
      const params = new URLSearchParams();
      if (text) params.set("text", text.slice(0, 500)); // limit length in query
      if (url) params.set("url", url);
      if (file) {
        params.set("fileName", file.name);
        params.set("fileType", file.type);
        params.set("kind", fileKind);
      }
      if (!fileKind && (text || url)) {
        params.set("kind", text ? "text" : "url");
      }
      router.push(`/results?${params.toString()}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="analyze" className="py-16 px-6 bg-black border-t border-gray-800">
      <h2 className="text-center text-3xl font-bold mb-6">Analyze Content</h2>
      <p className="text-center text-gray-400 mb-10 max-w-2xl mx-auto">
        Paste text or a link, or upload an image/audio/video. We will route you to a results page that explains credibility, reasoning, and next steps.
      </p>
      <form onSubmit={onSubmit} className="max-w-3xl mx-auto bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-6">
        {error ? (
          <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded-md">{error}</div>
        ) : null}

        <div>
          <label className="block text-sm text-gray-300 mb-2">Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste any text, caption, or transcript..."
            rows={4}
            className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/news-article"
            className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">Upload Media (Image, Audio, or Video)</label>
          <input
            type="file"
            accept={[...ACCEPTED_IMAGE, ...ACCEPTED_AUDIO, ...ACCEPTED_VIDEO].join(",")}
            onChange={onFileChange}
            className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500"
          />
          {file ? (
            <p className="text-sm text-gray-400 mt-2">Selected {fileKind}: {file.name}</p>
          ) : (
            <p className="text-sm text-gray-500 mt-2">Max size depends on your hosting; only standard formats supported.</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-gray-500 text-sm">We do not store your data in this demo. Files are not uploaded; metadata is passed for preview.</p>
          <button
            type="submit"
            disabled={submitting}
            className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 rounded-lg font-semibold text-white disabled:opacity-50"
          >
            {submitting ? "Redirecting..." : "Analyze Now"}
          </button>
        </div>
      </form>
    </section>
  );
}
