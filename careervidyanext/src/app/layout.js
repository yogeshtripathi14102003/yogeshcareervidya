

// import { Geist, Geist_Mono } from "next/font/google";
// import Script from "next/script";
// import "./globals.css";
// import AutoLogout from "../app/components/AutoLogout.js";
// import VisitorTracker from "@/app/components/VisitorTracker.jsx";
// import CopyProtection from "./components/CopyProtection";
// import ChatbotFloating from "./components/ChatbotFloating";
// import FloatingButtons from "./components/FloatingButtons"; // ✅ ADD
// import { AuthProvider } from "@/context/AuthContext.jsx";
// import QueryProvider from "@/providers/QueryProvider.jsx";
// import { Toaster } from "sonner";

// const geistSans = Geist({
//     variable: "--font-geist-sans",
//     subsets: ["latin"],
// });
// const geistMono = Geist_Mono({
//     variable: "--font-geist-mono",
//     subsets: ["latin"],
// });

// const SITE_URL = "https://careervidya.in";

// const DEFAULT_TITLE =
//     "CareerVidya: Find the Right Course, University & Career Path";
// const DEFAULT_DESC =
//     "CareerVidya — India's leading platform for online MBA, BBA & BCA admissions. Compare top universities, get expert advice, and secure your admission today.";

// export const metadata = {
//     metadataBase: new URL(SITE_URL),

//     title: {
//         default: DEFAULT_TITLE,
//         template: "%s | CareerVidya",
//     },

//     description: DEFAULT_DESC,

//     keywords:
//         "Compare online courses and universities, understand fees and eligibility, and get personalized guidance from CareerVidya experts.",

//     robots: {
//         index: true,
//         follow: true,
//         googleBot: {
//             index: true,
//             follow: true,
//             "max-image-preview": "large",
//             "max-snippet": -1,
//         },
//     },

//     alternates: {
//         canonical: "./",
//     },

//     openGraph: {
//         title: DEFAULT_TITLE,
//         description: DEFAULT_DESC,
//         url: SITE_URL,
//         siteName: "CareerVidya",
//         images: [
//             {
//                 url: "/og-banner.jpg",
//                 width: 1200,
//                 height: 630,
//                 alt: "Best Career Guidance & Online Education Platform India",
//             },
//         ],
//         locale: "en_IN",
//         type: "website",
//     },

//     twitter: {
//         card: "summary_large_image",
//         title: DEFAULT_TITLE,
//         description: DEFAULT_DESC,
//         images: ["/og-banner.jpg"],
//     },

//     icons: {
//         icon: "/favicon.ico",
//         apple: "/apple-touch-icon.png",
//     },
// };

// export const viewport = {
//     themeColor: "#ffffff",
// };

// export default function RootLayout({ children }) {
//     const schemaData = {
//         "@context": "https://schema.org",
//         "@type": "EducationalOrganization",
//         name: "CareerVidya",
//         url: SITE_URL,
//         logo: `${SITE_URL}/og-banner.jpg`,
//         sameAs: [
//             "https://x.com/CareerVidya",
//             "https://www.instagram.com/career_vidya/",
//             "https://www.facebook.com/Career-Vidya",
//             "https://youtube.com/@careervidya02",
//         ],
//     };

//     return (
//         <html lang="en">
//             <body
//                 className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//             >
//                 <Script
//                     id="educational-organization-schema"
//                     type="application/ld+json"
//                     dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
//                 />
//                 <CopyProtection />
//                 <VisitorTracker />
//                 <QueryProvider>
//                     <AuthProvider>
//                         <AutoLogout />

//                         {/* ✅ Floating Buttons (Global) — Left: WhatsApp, Right: Video */}
//                         <FloatingButtons
//                             whatsappNumber="919289716667"
//                             callNumber="919289716667"
//                             videoUrl="https://www.youtube.com/embed/VIDEO_ID"
//                         />

//                         <ChatbotFloating />
//                         {children}
//                         <Toaster richColors position="top-right" closeButton />
//                     </AuthProvider>
//                 </QueryProvider>
//             </body>
//         </html>
//     );
// }


import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import AutoLogout from "../app/components/AutoLogout.js";
import VisitorTracker from "@/app/components/VisitorTracker.jsx";
import CopyProtection from "./components/CopyProtection";
import ChatbotFloating from "./components/ChatbotFloating";
// import Chatbot from "./components/Chatbot"; // ✅ ADD
import FloatingButtons from "./components/FloatingButtons";
import { AuthProvider } from "@/context/AuthContext.jsx";
import QueryProvider from "@/providers/QueryProvider.jsx";
import { Toaster } from "sonner";

// ✅ Poppins — ek hi font, saare weights
const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
    display: "swap",
});

const SITE_URL = "https://careervidya.in";

const DEFAULT_TITLE =
    "CareerVidya: Find the Right Course, University & Career Path";
const DEFAULT_DESC =
    "CareerVidya — India's leading platform for online MBA, BBA & BCA admissions. Compare top universities, get expert advice, and secure your admission today.";

export const metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: DEFAULT_TITLE,
        template: "%s | CareerVidya",
    },

    description: DEFAULT_DESC,

    keywords:
        "Compare online courses and universities, understand fees and eligibility, and get personalized guidance from CareerVidya experts.",

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },

    alternates: {
        canonical: "./",
    },

    openGraph: {
        title: DEFAULT_TITLE,
        description: DEFAULT_DESC,
        url: SITE_URL,
        siteName: "CareerVidya",
        images: [
            {
                url: "/og-banner.jpg",
                width: 1200,
                height: 630,
                alt: "Best Career Guidance & Online Education Platform India",
            },
        ],
        locale: "en_IN",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: DEFAULT_TITLE,
        description: DEFAULT_DESC,
        images: ["/og-banner.jpg"],
    },

    icons: {
        icon: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
};

export const viewport = {
    themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        name: "CareerVidya",
        url: SITE_URL,
        logo: `${SITE_URL}/og-banner.jpg`,
        sameAs: [
            "https://x.com/CareerVidya",
            "https://www.instagram.com/career_vidya/",
            "https://www.facebook.com/Career-Vidya",
            "https://youtube.com/@careervidya02",
        ],
    };

    return (
        <html lang="en" className={poppins.variable}>
            <body className="antialiased">
                <Script
                    id="educational-organization-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
                />
                <CopyProtection />
                <VisitorTracker />
                <QueryProvider>
                    <AuthProvider>
                        <AutoLogout />

                        {/* ✅ Floating Buttons (Global) — Left: WhatsApp, Right: Video */}
                        <FloatingButtons
                            whatsappNumber="919289716667"
                            callNumber="919289716667"
                            videoUrl="https://www.youtube.com/embed/VIDEO_ID"
                        />


{/* <Chatbot /> */}
                        <ChatbotFloating />
                        {children}
                        <Toaster richColors position="top-right" closeButton />
                    </AuthProvider>
                </QueryProvider>
            </body>
        </html>
    );
}