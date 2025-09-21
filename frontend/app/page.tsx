// app/page.tsx
import Navbar from "@/components/navbar";
import Hero from "@/components/Hero";

export default function Home() {
    return (
        <main className="bg-black text-white min-h-screen">
            <Navbar />

            {/* Hero */}
            <Hero />

            {/* About Section */}
            <section id="about" className="relative py-16 sm:py-20 md:py-28">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                                About VeriFact
                            </h2>
                            <p className="mt-4 text-gray-300 leading-relaxed text-base sm:text-lg">
                                VeriFact is an AI-powered misinformation analysis platform that helps you quickly assess
                                the credibility of text, links, and media. Paste content or upload files to receive a
                                clear score, evidence-backed reasoning, and transparent citations. Built for students,
                                journalists, and teams who need trustworthy insights fast.
                            </p>
                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <a
                                    href="/sign-in"
                                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 transition-colors"
                                >
                                    Get Started
                                </a>
                                <a
                                    href="#features"
                                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 transition"
                                >
                                    Explore Features
                                </a>
                            </div>
                        </div>
                        <div className="relative mt-10 md:mt-0">
                            <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(168,85,247,0.15),transparent_60%)]" />
                            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-[0_0_60px_rgba(168,85,247,0.15)]">
                                <ul className="space-y-3 text-gray-200 text-sm sm:text-base">
                                    <li className="flex items-start gap-3">
                                        <span className="mt-1 h-2 w-2 rounded-full bg-pink-400" />
                                        AI-assisted verification with concise explanations
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="mt-1 h-2 w-2 rounded-full bg-purple-400" />
                                        Multiple input types: text, URLs, and media
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400" />
                                        Transparent sources and rationale for every result
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                                        Privacy-first: your data stays secure
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative py-16 sm:py-20 md:py-28">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_100%_0%,rgba(236,72,153,0.12),transparent_60%)]" />
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-center">
                        Powerful Features
                    </h2>
                    <p className="mt-3 text-gray-300 text-center max-w-2xl mx-auto text-base sm:text-lg">
                        Everything you need to evaluate information with confidence.
                    </p>

                    <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: 'Text Analysis', desc: 'Paste text to get credibility, claims extraction, and evidence summaries.', color: 'from-pink-500 to-purple-500' },
                            { title: 'Link/Article Check', desc: 'Analyze URLs for source reputation, bias, and factual consistency.', color: 'from-purple-500 to-indigo-500' },
                            { title: 'Image/Video Cues', desc: 'Basic media heuristics and reverse-signal prompts to spot tampering.', color: 'from-cyan-500 to-teal-500' },
                            { title: 'Source Transparency', desc: 'Citations and supporting references shown alongside each verdict.', color: 'from-fuchsia-500 to-pink-500' },
                            { title: 'Explainable Results', desc: 'Plain-language rationales with highlights of key indicators.', color: 'from-indigo-500 to-cyan-500' },
                            { title: 'Privacy & Security', desc: 'Session-based access; your inputs are protected and not shared.', color: 'from-emerald-500 to-teal-500' },
                        ].map((f, i) => (
                            <div key={i} className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 overflow-hidden">
                                <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-30 bg-gradient-to-br ${f.color}`} />
                                <h3 className="text-lg sm:text-xl font-semibold">{f.title}</h3>
                                <p className="mt-2 text-sm sm:text-base text-gray-300">{f.desc}</p>
                                <div className="mt-4">
                                    <a href="/sign-in" className="text-sm font-semibold text-white underline decoration-pink-400/50 group-hover:decoration-pink-400">
                                        Try now
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section id="reviews" className="relative py-16 sm:py-20 md:py-28">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-center">What People Say</h2>
                    <p className="mt-3 text-gray-300 text-center max-w-2xl mx-auto text-base sm:text-lg">
                        Real feedback from users who trust VeriFact.
                    </p>

                    <div className="mt-10">
                        <div className="
              flex gap-6 overflow-x-auto scrollbar-hide
              sm:grid sm:grid-cols-2 lg:grid-cols-3
            ">
                            {[
                                { name: "Ananya Sharma", text: "VeriFact saves me hours when fact-checking articles. The explanations are clear and unbiased." },
                                { name: "Rahul Menon", text: "I use it daily for academic research. The credibility scoring system is a game-changer." },
                                { name: "Priya Verma", text: "Finally, a tool that doesn’t just say true/false but shows reasoning and sources transparently." },
                                { name: "David Chen", text: "The platform’s simplicity makes it perfect for quick checks without overwhelming details." },
                            ].map((r, i) => (
                                <div
                                    key={i}
                                    className="min-w-[260px] sm:min-w-0 flex-shrink-0 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-md"
                                >
                                    <p className="text-gray-200 text-sm sm:text-base">“{r.text}”</p>
                                    <div className="mt-4 font-semibold text-white text-sm sm:text-base">{r.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact / CTA Section */}
            <section id="contact" className="relative py-16 sm:py-20 md:py-28">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 md:p-12 text-center shadow-[0_0_60px_rgba(168,85,247,0.15)]">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                            Start verifying with VeriFact
                        </h2>
                        <p className="mt-3 text-gray-300 text-base sm:text-lg">
                            Sign in to access the analyser. New here? Create an account in seconds.
                        </p>
                        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                            <a href="/sign-in" className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 transition-colors">
                                Sign In
                            </a>
                            <a href="/sign-up" className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition">
                                Create account
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
