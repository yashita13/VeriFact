(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/components/Hero.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>Hero
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/gsap/index.js [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function Hero() {
    _s();
    const rootRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const orbRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const titleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const subtitleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const ctaRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [brand, setBrand] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Hover/spotlight state
    const [isHover, setIsHover] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const hoverRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const [spot, setSpot] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        x: 50,
        y: 50
    });
    // Extract a simple average color from /ai.jpeg to theme gradients
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Hero.useEffect": ()=>{
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = "/ai.jpeg";
            img.onload = ({
                "Hero.useEffect": ()=>{
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
                        for(let i = 0; i < data.length; i += 4){
                            r += data[i];
                            g += data[i + 1];
                            b += data[i + 2];
                            count++;
                        }
                        r = Math.round(r / count);
                        g = Math.round(g / count);
                        b = Math.round(b / count);
                        // Convert to HSL to generate accents
                        const toHsl = {
                            "Hero.useEffect.toHsl": (r, g, b)=>{
                                r /= 255;
                                g /= 255;
                                b /= 255;
                                const max = Math.max(r, g, b), min = Math.min(r, g, b);
                                let h = 0, s = 0, l = (max + min) / 2;
                                if (max !== min) {
                                    const d = max - min;
                                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                                    switch(max){
                                        case r:
                                            h = (g - b) / d + (g < b ? 6 : 0);
                                            break;
                                        case g:
                                            h = (b - r) / d + 2;
                                            break;
                                        case b:
                                            h = (r - g) / d + 4;
                                            break;
                                    }
                                    h /= 6;
                                }
                                return {
                                    h,
                                    s,
                                    l
                                };
                            }
                        }["Hero.useEffect.toHsl"];
                        const hsl = toHsl(r, g, b);
                        const h = hsl.h * 360;
                        const make = {
                            "Hero.useEffect.make": function(hh) {
                                let s = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0.7, l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0.55;
                                return "hsl(".concat(Math.round((hh + 360) % 360), " ").concat(Math.round(s * 100), "% ").concat(Math.round(l * 100), "%)");
                            }
                        }["Hero.useEffect.make"];
                        const base = make(h, 0.75, 0.6);
                        const accent1 = make(h + 40, 0.9, 0.6);
                        const accent2 = make(h - 40, 0.9, 0.55);
                        setBrand({
                            base,
                            accent1,
                            accent2
                        });
                    } catch (e) {}
                }
            })["Hero.useEffect"];
        }
    }["Hero.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Hero.useEffect": ()=>{
            const ctx = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].context({
                "Hero.useEffect.ctx": ()=>{
                    // Entrance
                    const items = [
                        titleRef.current,
                        subtitleRef.current,
                        ctaRef.current
                    ].filter(Boolean);
                    if (items.length) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].from(items, {
                            opacity: 0,
                            y: 30,
                            duration: 1,
                            stagger: 0.1,
                            ease: "power3.out"
                        });
                    }
                    // Orb breathing
                    if (orbRef.current) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].to(orbRef.current, {
                            filter: "blur(16px)",
                            duration: 2.5,
                            repeat: -1,
                            yoyo: true,
                            ease: "sine.inOut"
                        });
                    }
                    // Soft rotation/shimmer via background position
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].to(".orb-gradient", {
                        duration: 10,
                        backgroundPosition: "200% 50%",
                        repeat: -1,
                        ease: "none"
                    });
                }
            }["Hero.useEffect.ctx"], rootRef);
            const onMove = {
                "Hero.useEffect.onMove": (e)=>{
                    const el = rootRef.current;
                    if (!el) return;
                    const rect = el.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    const dx = (e.clientX - cx) / rect.width;
                    const dy = (e.clientY - cy) / rect.height;
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].to(orbRef.current, {
                        x: dx * 40,
                        y: dy * 40,
                        duration: 0.6,
                        ease: "sine.out"
                    });
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].to(".parallax", {
                        x: dx * 20,
                        y: dy * 20,
                        duration: 0.6,
                        ease: "sine.out"
                    });
                    // spotlight position while hovering
                    if (hoverRef.current) {
                        const px = (e.clientX - rect.left) / rect.width * 100;
                        const py = (e.clientY - rect.top) / rect.height * 100;
                        setSpot({
                            x: Math.max(0, Math.min(100, px)),
                            y: Math.max(0, Math.min(100, py))
                        });
                    }
                }
            }["Hero.useEffect.onMove"];
            window.addEventListener("mousemove", onMove);
            return ({
                "Hero.useEffect": ()=>{
                    window.removeEventListener("mousemove", onMove);
                    ctx.revert();
                }
            })["Hero.useEffect"];
        }
    }["Hero.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "home",
        ref: rootRef,
        className: "relative overflow-hidden px-6 pt-10 pb-14 md:pt-14 md:pb-16",
        onMouseEnter: ()=>{
            hoverRef.current = true;
            setIsHover(true);
            try {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].to(orbRef.current, {
                    scale: 1.08,
                    boxShadow: "0 0 160px 30px rgba(168,85,247,0.45)",
                    duration: 0.6,
                    ease: "power3.out"
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].to(ctaRef.current, {
                    scale: 1.02,
                    duration: 0.4,
                    ease: "power3.out"
                });
            } catch (e) {}
        },
        onMouseLeave: ()=>{
            hoverRef.current = false;
            setIsHover(false);
            try {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].to(orbRef.current, {
                    scale: 1,
                    boxShadow: "0 0 120px 20px rgba(168,85,247,0.25)",
                    duration: 0.5,
                    ease: "power3.out"
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].to(ctaRef.current, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power3.out"
                });
            } catch (e) {}
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 -z-10 opacity-30",
                style: {
                    backgroundImage: "url(/ai.jpeg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }
            }, void 0, false, {
                fileName: "[project]/components/Hero.tsx",
                lineNumber: 147,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,rgba(120,0,255,0.35),transparent_70%)]"
            }, void 0, false, {
                fileName: "[project]/components/Hero.tsx",
                lineNumber: 149,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute inset-0 bg-[radial-gradient(40%_40%_at_0%_0%,rgba(255,0,128,0.25),transparent_60%)]"
            }, void 0, false, {
                fileName: "[project]/components/Hero.tsx",
                lineNumber: 150,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute inset-0 bg-[radial-gradient(40%_40%_at_100%_100%,rgba(0,255,204,0.12),transparent_60%)]"
            }, void 0, false, {
                fileName: "[project]/components/Hero.tsx",
                lineNumber: 151,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "order-2 md:order-1 text-center md:text-left",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                ref: titleRef,
                                className: "text-4xl md:text-6xl font-extrabold leading-tight tracking-tight",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "block text-white",
                                        children: "VeriFact"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Hero.tsx",
                                        lineNumber: 156,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "block mt-1 bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent",
                                        children: "Misinformation Analysis"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Hero.tsx",
                                        lineNumber: 157,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Hero.tsx",
                                lineNumber: 155,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                ref: subtitleRef,
                                className: "mt-4 text-sm md:text-base text-gray-300 max-w-xl mx-auto md:mx-0",
                                children: "Professional, AI‑powered verification for text, links, and media—clear credibility scores with simple explanations."
                            }, void 0, false, {
                                fileName: "[project]/components/Hero.tsx",
                                lineNumber: 159,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        ref: ctaRef,
                                        href: "/sign-in",
                                        className: "inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-purple-600 shadow-[0_0_40px_rgba(168,85,247,0.35)] hover:from-pink-400 hover:to-purple-500 transition-colors",
                                        children: "Get started"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Hero.tsx",
                                        lineNumber: 163,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "#about",
                                        className: "inline-flex items-center justify-center px-6 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition",
                                        children: "Learn More"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Hero.tsx",
                                        lineNumber: 166,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Hero.tsx",
                                lineNumber: 162,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Hero.tsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "order-1 md:order-2 relative h-[320px] sm:h-[380px] md:h-[460px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-72 sm:w-80 md:w-[380px] h-72 sm:h-80 md:h-[380px] rounded-full blur-2xl",
                                    style: {
                                        backgroundImage: "linear-gradient(135deg, ".concat((brand === null || brand === void 0 ? void 0 : brand.base) || 'rgba(124,58,237,0.4)', " , ").concat((brand === null || brand === void 0 ? void 0 : brand.accent1) || 'rgba(236,72,153,0.35)', " , ").concat((brand === null || brand === void 0 ? void 0 : brand.accent2) || 'rgba(99,102,241,0.3)', ")")
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/components/Hero.tsx",
                                    lineNumber: 176,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/Hero.tsx",
                                lineNumber: 175,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: orbRef,
                                className: "orb-gradient absolute inset-0 m-auto w-64 sm:w-80 md:w-[360px] h-64 sm:h-80 md:h-[360px] rounded-full shadow-[0_0_120px_20px_rgba(168,85,247,0.25)]",
                                style: {
                                    backgroundImage: "conic-gradient(from_180deg_at_50%_50%, ".concat((brand === null || brand === void 0 ? void 0 : brand.base) || '#7c3aed', " 0%, ").concat((brand === null || brand === void 0 ? void 0 : brand.accent1) || '#ec4899', " 25%, ").concat((brand === null || brand === void 0 ? void 0 : brand.accent2) || '#06b6d4', " 50%, ").concat((brand === null || brand === void 0 ? void 0 : brand.base) || '#7c3aed', " 100%)")
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/Hero.tsx",
                                lineNumber: 179,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 m-auto w-48 sm:w-64 md:w-[300px] h-48 sm:h-64 md:h-[300px] rounded-full bg-gradient-to-br from-white/30 to-white/0 opacity-30 rotate-12"
                            }, void 0, false, {
                                fileName: "[project]/components/Hero.tsx",
                                lineNumber: 181,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Hero.tsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Hero.tsx",
                lineNumber: 153,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Hero.tsx",
        lineNumber: 139,
        columnNumber: 5
    }, this);
}
_s(Hero, "mT02tan623hvn2iiY9vHYbzdhuo=");
_c = Hero;
var _c;
__turbopack_context__.k.register(_c, "Hero");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=components_Hero_tsx_c963ffe1._.js.map