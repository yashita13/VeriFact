// app/page.tsx
import Navbar from "@/components/navbar";
import UploadForm from "@/components/UploadForm";
import Hero from "@/components/Hero";

export default function Home() {
    return (
        <main className="bg-black text-white min-h-screen">

            <Navbar />

            {/* Cool Animated Hero */}
            <Hero />

            {/* Features */}
            <section className="py-20 px-10 bg-black">
                <h2 className="text-center text-3xl font-bold mb-10">
                    Instant Detection & Education
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: "Effortless Detection", desc: "Paste text or upload media, let AI analyze it instantly." },
                        { title: "Your Safety, Our Tech", desc: "Discover manipulative patterns behind fake content." },
                        { title: "AI-Powered Awareness", desc: "Stay updated with scams & misinformation trends." },
                        { title: "Simple & Fast", desc: "One-click detection for quick fact checking." },
                        { title: "Detailed Reports", desc: "Get in-depth reasoning & credibility scores." },
                        { title: "Trusted AI Assistant", desc: "Chat with AI to learn how to identify misinformation." },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800 hover:border-purple-500 transition"
                        >
                            <h3 className="text-xl font-semibold mb-2 text-purple-400">{item.title}</h3>
                            <p className="text-gray-400">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section id="learn" className="py-20 px-10 bg-black border-t border-gray-800">
                <h2 className="text-center text-3xl font-bold mb-10">How It Works</h2>
                <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-center">
                    {["1. Select Input", "2. AI Analyze", "3. Get Results"].map((step, i) => (
                        <div key={i} className="p-6 bg-gray-900 rounded-lg border border-gray-700">
                            <p className="text-lg font-semibold">{step}</p>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-10">
                    <a href="#analyze" className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 rounded-lg font-semibold text-white inline-block">
                        Try For Free
                    </a>
                </div>
            </section>

            <UploadForm />
        </main>
    );
}
