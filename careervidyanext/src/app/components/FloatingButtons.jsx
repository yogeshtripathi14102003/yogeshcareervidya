"use client";

import { useState, useEffect } from "react";

export default function FloatingButtons({
    whatsappNumber = "919289716667",
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const whatsappMessage = encodeURIComponent(
        "Hi, I want to know about online courses, fees and admission process."
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    const handleWhatsAppClick = () => {
        if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "whatsapp_click", {
                event_category: "engagement",
                event_label: "floating_button",
            });
        }
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <button
            onClick={handleWhatsAppClick}
            aria-label="Chat on WhatsApp"
            className="group fixed left-3 md:left-5 bottom-12 md:bottom-16 z-[999] w-12 h-12 md:w-14 md:h-14 bg-[#25D366] hover:bg-[#20BD5A] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
        >
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30"></span>

            <svg
                viewBox="0 0 32 32"
                className="w-6 h-6 md:w-7 md:h-7 fill-white relative z-10"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M16.004 0h-.008C7.174 0 .005 7.169.005 16c0 3.5 1.128 6.744 3.045 9.381L1.05 31.472l6.303-1.977A15.9 15.9 0 0016.004 32C24.826 32 32 24.826 32 16S24.826 0 16.004 0zm9.301 22.535c-.389 1.098-2.279 2.135-3.151 2.204-.871.069-1.68.32-5.686-1.182-4.826-1.899-7.898-6.829-8.135-7.147-.237-.318-1.943-2.585-1.943-4.931 0-2.346 1.231-3.502 1.667-3.977.436-.475.95-.594 1.266-.594.317 0 .633.003.909.016.291.014.683-.11 1.068.815.389.936 1.32 3.228 1.436 3.462.116.237.194.51.039.826-.155.318-.233.516-.46.794-.237.279-.483.623-.689.836-.237.237-.485.495-.208.969.277.475 1.231 2.029 2.643 3.289 1.815 1.617 3.34 2.118 3.815 2.356.475.237.752.198 1.031-.118.279-.318 1.185-1.38 1.502-1.855.317-.475.633-.396 1.068-.237.436.158 2.751 1.297 3.226 1.534.475.237.791.356.909.554.116.198.116 1.148-.275 2.246z" />
            </svg>

            <span className="hidden md:block absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                Chat on WhatsApp
                <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></span>
            </span>
        </button>
    );
}