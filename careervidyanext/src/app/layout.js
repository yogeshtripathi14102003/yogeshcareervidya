// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata = {
//   title: "CreerVidya - Best Career Guidance Platform",
//   description: "Explore career paths, mentors, and guidance to shape your future.",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <head>
//         {/* ✅ Working Favicon Setup */}
//         <link
//           rel="icon"
//           type="image/png"
//           href="/favicon.ico"
//           sizes="any"
//         />
//         {/* Optional: for different formats */}
//         {/* <link rel="icon" type="image/svg+xml" href="/favicon.svg" /> */}
//         {/* <link rel="apple-touch-icon" href="/apple-touch-icon.png" /> */}
//         <meta name="theme-color" content="#ffffff" />
//       </head>

//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         {children}
//       </body>
//     </html>
//   );
// }


import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://www.careervidya.in"), // ✅ Fix for metadataBase
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

// ✅ themeColor now goes here (not inside metadata)
export const viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Favicon and SEO */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="description"
          content="Explore career paths, mentors, and expert guidance to shape your future with CareerVidya."
        />
        <meta
          name="keywords"
          content="CareerVidya, career guidance, education, mentorship, students, future planning"
        />
        <meta
          property="og:title"
          content="CareerVidya - Best Career Guidance Platform"
        />
        <meta
          property="og:description"
          content="Explore career paths, mentors, and expert guidance to shape your future."
        />
        <meta property="og:url" content="https://www.careervidya.in" />
        <meta property="og:type" content="website" />
        <title>CareerVidya - Best Career Guidance Platform</title>
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
