


import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AutoLogout from "../app/components/AutoLogout.js";
import VisitorTracker from "@/app/components/VisitorTracker.jsx"; // ✅ ADD

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
  title: "CareerVidya - Best Career Guidance Platform",
  description:
    "Explore career paths, mentors, and expert guidance to shape your future with CareerVidya.",
  keywords:
    "CareerVidya, career guidance, education platform, learning, mentorship, students, jobs, future planning",
  openGraph: {
    title: "CareerVidya - Best Career Guidance Platform",
    description:
      "Explore career paths, mentors, and expert guidance to shape your future.",
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
        <VisitorTracker /> {/* ✅ VISITOR TRACKING */}
        <AutoLogout />     {/* ✅ AUTO LOGOUT */}
        {children}
      </body>
    </html>
  );
}
