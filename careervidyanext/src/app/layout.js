
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AutoLogout from "../app/components/AutoLogout.js";
import VisitorTracker from "@/app/components/VisitorTracker.jsx"; // ✅ ADD
import CopyProtection from "./components/CopyProtection";
import MobileNavigation from "./components/MobileNavigation";
import ChatbotFloating from "./components/ChatbotFloating";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata = {
  metadataBase: new URL("https://www.careervidya.in"),
  title: "CareerVidya: Best Career Guidance & Online Education Platform India",
 description: "Shape your future with CareerVidya. Access expert career guidance, mentorship programs, top online courses, and job planning tools for students and professionals.",
 keywords: "CareerVidya, career guidance, online education platform, mentorship programs, student career planning, job placement assistance, top online courses in India",
  openGraph: {
    title: "CareerVidya: Unlock Your Potential with Expert Guidance",
    description:
      "Join CareerVidya to access top online courses, professional mentorship, and career planning tools tailored for your success.",
    url: "https://www.careervidya.in",
    siteName: "CareerVidya",
    images: [
      {
        url: "/favicon.ico",
        width: 1200,
        height: 630,
        alt: "CareerVidya Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <CopyProtection />
        <MobileNavigation />
        <VisitorTracker /> {/* ✅ VISITOR TRACKING */}
        <AutoLogout />     {/* ✅ AUTO LOGOUT */}
        <ChatbotFloating />
        {children}
      </body>
    </html>
  );
}
