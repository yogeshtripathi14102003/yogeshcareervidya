
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import AutoLogout from "../app/components/AutoLogout.js";
// import VisitorTracker from "@/app/components/VisitorTracker.jsx"; // ✅ ADD
// import CopyProtection from "./components/CopyProtection";
// // import MobileNavigation from "./components/MobileNavigation";
// import ChatbotFloating from "./components/ChatbotFloating";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });
// export const metadata = {
//   metadataBase: new URL("https://www.careervidya.in"),
//   title: "CareerVidya: Best Career Guidance & Online Education Platform India",
//  description: "Shape your future with CareerVidya. Access expert career guidance, mentorship programs, top online courses, and job planning tools for students and professionals.",
//  keywords: "CareerVidya, career guidance, online education platform, mentorship programs, student career planning, job placement assistance, top online courses in India",
//   openGraph: {
//     title: "CareerVidya: Unlock Your Potential with Expert Guidance",
//     description:
//       "Join CareerVidya to access top online courses, professional mentorship, and career planning tools tailored for your success.",
//     url: "https://www.careervidya.in",
//     siteName: "CareerVidya",
//     images: [
//       {
//         url: "/favicon.ico",
//         width: 1200,
//         height: 630,
//         alt: "CareerVidya Logo",
//       },
//     ],
//     locale: "en_IN",
//     type: "website",
//   },
//   icons: {
//     icon: "/favicon.ico",
//     apple: "/apple-touch-icon.png",
//   },
// };
// export const viewport = {
//   themeColor: "#ffffff",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <head>
//         <link rel="icon" href="/favicon.ico" sizes="any" />
//         <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
//       </head>
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >

//         <CopyProtection />
//         {/* <MobileNavigation /> */}
//         <VisitorTracker /> {/* ✅ VISITOR TRACKING */}
//         <AutoLogout />     {/* ✅ AUTO LOGOUT */}
//         <ChatbotFloating />
//         {children}
//       </body>
//     </html>
//   );
// }

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AutoLogout from "../app/components/AutoLogout.js";
import VisitorTracker from "@/app/components/VisitorTracker.jsx";
import CopyProtection from "./components/CopyProtection";
// import MobileNavigation from "./components/MobileNavigation";
import ChatbotFloating from "./components/ChatbotFloating";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ⚠️ IMPORTANT: Pick ONE canonical domain (non-www shown here since
// https://careervidya.in is what actually serves the site).
// If you prefer www, change this AND set up a 301 redirect at the
// server/CDN/DNS level so the other version always redirects here.
const SITE_URL = "https://careervidya.in";

export const metadata = {
  metadataBase: new URL(SITE_URL),

  // Title template lets child pages do: title: "Course Name"
  // and it auto-becomes "Course Name | CareerVidya"
  title: {
    default: "CareerVidya: Best Career Guidance & Online Education Platform India",
    template: "%s | CareerVidya",
  },
  description:
    "Shape your future with CareerVidya. Access expert career guidance, mentorship programs, top online courses, and job planning tools for students and professionals.",

  // NOTE: 'keywords' meta tag is ignored by Google since ~2009.
  // Left here harmlessly, but it has zero ranking value — don't rely on it.
  keywords:
    "CareerVidya, career guidance, online education platform, mentorship programs, student career planning, job placement assistance, top online courses in India",

  // ✅ Explicit robots directives (Next.js defaults to indexable, but being
  // explicit avoids accidental noindex from env config and documents intent)
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

  // ✅ Canonical for homepage. Child pages should override this with their
  // own canonical (see generateMetadata example you'll need on course/
  // university pages).
  alternates: {
    canonical: SITE_URL,
  },

  openGraph: {
    title: "CareerVidya: Unlock Your Potential with Expert Guidance",
    description:
      "Join CareerVidya to access top online courses, professional mentorship, and career planning tools tailored for your success.",
    url: SITE_URL,
    siteName: "CareerVidya",
    images: [
      {
        url: "/og-banner.jpg",
        width: 1200,
        height: 630,
        alt: "CareerVidya Banner",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "CareerVidya: Unlock Your Potential with Expert Guidance",
    description:
      "Join CareerVidya to access top online courses, professional mentorship, and career planning tools tailored for your success.",
    images: ["/og-banner.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  // ✅ Helps Google Search Console verification etc. — fill in if you have one
  // verification: {
  //   google: "your-google-site-verification-code",
  // },
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

        {/* ✅ Organization structured data — helps Google understand the
            business entity, can enable sitelinks/knowledge panel info */}
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
        {/* <MobileNavigation /> */}
        <VisitorTracker />
        <AutoLogout />
        <ChatbotFloating />
        {children}
      </body>
    </html>
  );
}