import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AutoLogout from "../app/components/AutoLogout.js";
import VisitorTracker from "@/app/components/VisitorTracker.jsx";
import CopyProtection from "./components/CopyProtection";
import ChatbotFloating from "./components/ChatbotFloating";
import { AuthProvider } from "@/context/AuthContext.jsx";
import QueryProvider from "@/providers/QueryProvider.jsx";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://careervidya.in";

// ✅ Ek jagah title define karo — teeno jagah same use hoga
const DEFAULT_TITLE = "CareerVidya: Best Career Guidance & Online Education Platform India";
const DEFAULT_DESC = "CareerVidya — India's leading platform for online MBA, BBA & BCA admissions. Compare top universities, get expert advice, and secure your admission today.";
export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: DEFAULT_TITLE,
    template: "%s | CareerVidya",
  },

  description: DEFAULT_DESC,

  keywords:
    "CareerVidya, career guidance, online education platform, mentorship programs, student career planning, job placement assistance, top online courses in India",

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
    canonical: SITE_URL,
  },

  openGraph: {
    title: DEFAULT_TITLE,        // ✅ Same as title
    description: DEFAULT_DESC,  // ✅ Same as description
    url: SITE_URL,
    siteName: "CareerVidya",
    images: [
      {
        url: "/og-banner.jpg",
        width: 1200,
        height: 630,
        alt: "CareerVidya - Best Career Guidance & Online Education Platform India",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,        // ✅ Same as title
    description: DEFAULT_DESC,  // ✅ Same as description
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
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CopyProtection />
        <VisitorTracker />
        <QueryProvider>
          <AuthProvider>
            <AutoLogout />
            <ChatbotFloating />
            {children}
            <Toaster richColors position="top-right" closeButton />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}