import React from 'react'

const Navbar = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="mt-3 mb-2 flex items-center justify-between rounded-xl border border-white/10 bg-black/30 backdrop-transparent-md px-4 sm:px-6 py-3">
                    {/* Left: Logo + Name */}
                    <a href="#home" className="flex items-center gap-3">
                        <img
                            src="/img.png"
                            alt="VeriFact logo"
                            className="w-9 h-9 rounded-full ring-1 ring-white/10"
                        />
                        <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            VeriFact
                        </span>
                    </a>

                    {/* Right: Links (+ CTA) */}
                    <div className="hidden md:flex items-center gap-6">
                        <nav className="flex items-center gap-6">
                            <a href="#home" className="hover:text-pink-300 transition-colors">Home</a>
                            <a href="#about" className="hover:text-pink-300 transition-colors">About</a>
                            <a href="#features" className="hover:text-pink-300 transition-colors">Features</a>
                            <a href="#contact" className="hover:text-pink-300 transition-colors">Contact</a>
                            <a href="/sign-in" className="hover:text-pink-300 transition-colors">Sign In</a>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    )
}
export default Navbar
