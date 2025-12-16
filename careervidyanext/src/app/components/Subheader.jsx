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

          <Link href="https://linkedin.com" target="_blank">
            <div className="social-circle">
              <Image src="/images/i5.png" alt="LinkedIn" width={20} height={20} className="circle-img" />
            </div>
          </Link>

          <Link href="https://twitter.com" target="_blank">
            <div className="social-circle">
              <Image src="/images/i4.png" alt="Twitter" width={20} height={20} className="circle-img" />
            </div>
          </Link>

          <Link href="https://instagram.com" target="_blank">
            <div className="social-circle">
              <Image src="/images/i3.png" alt="Instagram" width={24} height={24} className="circle-img" />
            </div>
          </Link>

          <Link href="https://facebook.com" target="_blank">
            <div className="social-circle">
              <Image src="/images/i2.png" alt="Facebook" width={26} height={26} className="circle-img" />
            </div>
          </Link>

          <Link href="https://youtube.com" target="_blank">
            <div className="social-circle">
              <Image src="/images/i1.png" alt="YouTube" width={30} height={30} className="circle-img" />
            </div>
          </Link>

        </div>

      </div>
    </div>
  );
}


// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import "./TopHeader.css";

// export default function TopHeader() {
//   const [visible, setVisible] = useState(true);

//   if (!visible) return null;

//   return (
//     <div className="topheader-container">
//       <div className="topheader-inner">

//         {/* Center Logo with typewriter word animation */}
//         <div className="topheader-center">
//           <Link href="/">
//             <h1 className="animated-logo">
//               <span>Vidya</span>
//               <span>Hai</span>
//               <span>Toh</span>
//               <span>Success</span>
//               <span>Hai</span>
//               <span>!!</span>
//             </h1>
//           </Link>
//         </div>

//         {/* Right Side Icons */}
//         <div className="topheader-right">

//           <Link href="https://www.linkedin.com" target="_blank">
//             <img
//               src="/images/in.png"
//               alt="Linkedin"
//               width={18}
//               height={18}
//               className="icon-img"
//             />
//           </Link>

//           <Link href="https://twitter.com" target="_blank">
//             <img
//               src="/images/X.jpeg"
//               alt="Twitter / X"
//               width={18}
//               height={18}
//               className="icon-img"
//             />
//           </Link>

//           <Link href="https://instagram.com" target="_blank">
//             <img
//               src="/images/insta.png"
//               alt="Instagram"
//               width={18}
//               height={18}
//               className="icon-img"
//             />
//           </Link>

//           <Link href="https://facebook.com" target="_blank">
//             <img
//               src="/images/fb.png"
//               alt="Facebook"
//               width={18}
//               height={18}
//               className="icon-img"
//             />
//           </Link>

//           <Link href="https://youtube.com" target="_blank">
//             <img
//               src="/images/youtube.jpg"
//               alt="YouTube"
//               width={18}
//               height={18}
//               className="icon-img"
//             />
//           </Link>

//         </div>

//       </div>
//     </div>
//   );
// }
