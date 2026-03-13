"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import "./TopHeader.css";

export default function TopHeader() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="topheader-container">
      <div className="topheader-inner">

        {/* Logo */}
        <div className="topheader-center">
          {/* <Link href="/">
            <Image
              src="/images/tagline.jpg"
              alt="Career Vidya Logo"
              width={190}
              height={190}
              className="topheader-logo blinking-logo"
              priority
            />
          </Link> */}
        </div>

        {/* Social Icons */}
        <div className="topheader-right">
          <nav className="top-nav-links">
            <Link href="/Aboutus" className="top-link">About</Link>
            <span className="separator">|</span>
            <Link href="/contactus" className="top-link">Contact</Link>
            <span className="separator">|</span>
            <Link href="/blog" className="top-link">Blog</Link>
               {/* <Link href="/coming-soon" className="top-link">Blog</Link> */}
          </nav>
        </div>

      </div>
    </div>
  );
}

