"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

// ADD THIS ICON COMPONENT
const WhatsAppIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-5 h-5 mr-2"
        fill="currentColor"
    >
      <path d="M16.6 14.2c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.7-.8.9-.1.1-.3.2-.5.1-.2-.1-.9-.3-1.8-1.1-.7-.6-1.1-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.2-.2.4-.4.1-.1.2-.2.2-.4.1-.1.1-.3 0-.4-.1-.1-1.2-2.8-1.6-3.8-.4-.9-.8-1-.9-1h-.5c-.2 0-.4.1-.6.3s-.7.7-.7 1.6.7 3.1 1.7 4.1c1 1 1.9 1.9 3.4 2.6.4.2.8.3 1.1.4.5.1 1-.1 1.4-.3.4-.2.6-.5.8-.9.2-.4.2-.7.1-1zM12 2a10 10 0 100 20 10 10 0 000-20zm0 18.2a8.2 8.2 0 110-16.4 8.2 8.2 0 010 16.4z" />
    </svg>
);

/**
 * Futuristic hero inspired by the provided reference:
 * - Big bold title with neon outline
 * - Animated glowing orb with subtle pulse
 * - Floating particles and parallax mouse reaction
 */
export default function Hero() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const orbRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);

  const [brand, setBrand] = useState<{ base: string; accent1: string; accent2: string } | null>(null);

  // Hover/spotlight state
  const [isHover, setIsHover] = useState(false);
  const hoverRef = useRef(false);
  const [spot, setSpot] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  // --- REPLACE THE OLD CONFIG BLOCK WITH THIS CORRECTED ONE ---
  const twilioWhatsAppNumber = "14155238886"; // The exact number from your screenshot
  const preFilledMessage = "join shoulder-managed"; // The exact join code from your screenshot
  const whatsappUrl = `https://wa.me/${twilioWhatsAppNumber}?text=${encodeURIComponent(preFilledMessage)}`;
  // --- END OF CORRECTED BLOCK ---

  // Extract a simple average color from /ai.jpeg to theme gradients
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/ai.jpeg";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const size = 32;
        canvas.width = size;
        canvas.height = size;
        const ctx2 = canvas.getContext("2d");
        if (!ctx2) return;
        ctx2.drawImage(img, 0, 0, size, size);
        const data = ctx2.getImageData(0, 0, size, size).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        // Convert to HSL to generate accents
        const toHsl = (r:number,g:number,b:number) => {
          r/=255; g/=255; b/=255;
          const max = Math.max(r,g,b), min = Math.min(r,g,b);
          let h=0,s=0,l=(max+min)/2;
          if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d/(2-max-min) : d/(max+min);
            switch(max){
              case r: h=(g-b)/d + (g<b?6:0); break;
              case g: h=(b-r)/d + 2; break;
              case b: h=(r-g)/d + 4; break;
            }
            h/=6;
          }
          return {h, s, l};
        };
        const hsl = toHsl(r,g,b);
        const h = hsl.h * 360;
        const make = (hh:number, s=0.7, l=0.55) => `hsl(${Math.round((hh+360)%360)} ${Math.round(s*100)}% ${Math.round(l*100)}%)`;
        const base = make(h, 0.75, 0.6);
        const accent1 = make(h + 40, 0.9, 0.6);
        const accent2 = make(h - 40, 0.9, 0.55);
        setBrand({ base, accent1, accent2 });
      } catch {}
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance
      const items = [titleRef.current, subtitleRef.current, ctaRef.current].filter(Boolean) as Element[];
      if (items.length) {
        gsap.from(items, {
          opacity: 0,
          y: 30,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
        });
      }

      // Orb breathing
      if (orbRef.current) {
        gsap.to(orbRef.current, {
          filter: "blur(16px)",
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Soft rotation/shimmer via background position
      gsap.to(".orb-gradient", {
        duration: 10,
        backgroundPosition: "200% 50%",
        repeat: -1,
        ease: "none",
      });
    }, rootRef);

    const onMove = (e: MouseEvent) => {
      const el = rootRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      gsap.to(orbRef.current, { x: dx * 40, y: dy * 40, duration: 0.6, ease: "sine.out" });
      gsap.to(".parallax", { x: dx * 20, y: dy * 20, duration: 0.6, ease: "sine.out" });

      // spotlight position while hovering
      if (hoverRef.current) {
        const px = ((e.clientX - rect.left) / rect.width) * 100;
        const py = ((e.clientY - rect.top) / rect.height) * 100;
        setSpot({ x: Math.max(0, Math.min(100, px)), y: Math.max(0, Math.min(100, py)) });
      }
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="home"
      ref={rootRef}
      className="relative overflow-hidden px-6 pt-10 pb-14 md:pt-14 md:pb-16"
      onMouseEnter={() => { hoverRef.current = true; setIsHover(true); try { gsap.to(orbRef.current, { scale: 1.08, boxShadow: "0 0 160px 30px rgba(168,85,247,0.45)", duration: 0.6, ease: "power3.out" }); gsap.to(ctaRef.current, { scale: 1.02, duration: 0.4, ease: "power3.out" }); } catch {} }}
      onMouseLeave={() => { hoverRef.current = false; setIsHover(false); try { gsap.to(orbRef.current, { scale: 1, boxShadow: "0 0 120px 20px rgba(168,85,247,0.25)", duration: 0.5, ease: "power3.out" }); gsap.to(ctaRef.current, { scale: 1, duration: 0.3, ease: "power3.out" }); } catch {} }}
    >
      {/* Background image from /public/ai.jpeg */}
      <div className="absolute inset-0 -z-10 opacity-30" style={{ backgroundImage: "url(/ai.jpeg)", backgroundSize: "cover", backgroundPosition: "center" }} />
      {/* Gradient vignettes */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,rgba(120,0,255,0.35),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_40%_at_0%_0%,rgba(255,0,128,0.25),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_40%_at_100%_100%,rgba(0,255,204,0.12),transparent_60%)]" />

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div className="order-2 md:order-1 text-center md:text-left">
          <h1 ref={titleRef} className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            <span className="block text-white">VeriFact</span>
            <span className="block mt-1 bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">Misinformation Analysis</span>
          </h1>
          <p ref={subtitleRef} className="mt-4 text-sm md:text-base text-gray-300 max-w-xl mx-auto md:mx-0">
            Professional, AI‑powered verification for text, links, and media—clear credibility scores with simple explanations.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a ref={ctaRef} href="/sign-in" className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-purple-600 shadow-[0_0_40px_rgba(168,85,247,0.35)] hover:from-pink-400 hover:to-purple-500 transition-colors">
              Get started
            </a>
            {/* --- ADD THIS NEW BUTTON --- */}
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold bg-green-600 hover:bg-green-500 transition-colors"
            >
              <WhatsAppIcon />
              Chat on WhatsApp
            </a>
            {/* --- END OF NEW BUTTON --- */}
            <a href="#about" className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition">
              Learn More
            </a>
          </div>
        </div>

        {/* Orb Scene */}
        <div className="order-1 md:order-2 relative h-[320px] sm:h-[380px] md:h-[460px]">
          {/* Outer glow ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-72 sm:w-80 md:w-[380px] h-72 sm:h-80 md:h-[380px] rounded-full blur-2xl" style={{backgroundImage:`linear-gradient(135deg, ${brand?.base || 'rgba(124,58,237,0.4)'} , ${(brand?.accent1 || 'rgba(236,72,153,0.35)')} , ${(brand?.accent2 || 'rgba(99,102,241,0.3)')})`}} />
          </div>
          {/* Neon Orb */}
          <div ref={orbRef} className="orb-gradient absolute inset-0 m-auto w-64 sm:w-80 md:w-[360px] h-64 sm:h-80 md:h-[360px] rounded-full shadow-[0_0_120px_20px_rgba(168,85,247,0.25)]" style={{backgroundImage:`conic-gradient(from_180deg_at_50%_50%, ${brand?.base || '#7c3aed'} 0%, ${brand?.accent1 || '#ec4899'} 25%, ${brand?.accent2 || '#06b6d4'} 50%, ${brand?.base || '#7c3aed'} 100%)`}} />
          {/* Inner gloss */}
          <div className="absolute inset-0 m-auto w-48 sm:w-64 md:w-[300px] h-48 sm:h-64 md:h-[300px] rounded-full bg-gradient-to-br from-white/30 to-white/0 opacity-30 rotate-12" />
        </div>
      </div>
    </section>
  );
}
