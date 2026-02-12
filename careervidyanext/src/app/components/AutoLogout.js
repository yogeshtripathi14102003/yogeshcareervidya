

// "use client";

// import { useEffect } from "react";

// export default function AutoLogout() {
//   useEffect(() => {
//     let timer;

//     const logoutNow = () => {
//       localStorage.removeItem("admintoken");

//       document.cookie = "admintoken=; Max-Age=0";

//       window.location.href = "/login";
//     };

//     const resetTimer = () => {
//       clearTimeout(timer);
//       timer = setTimeout(logoutNow, 15 * 60 * 1000); // 15 min
//     };

//     window.addEventListener("mousemove", resetTimer);
//     window.addEventListener("keydown", resetTimer);
//     window.addEventListener("click", resetTimer);
//     window.addEventListener("scroll", resetTimer);

//     resetTimer();

//     return () => {
//       window.removeEventListener("mousemove", resetTimer);
//       window.removeEventListener("keydown", resetTimer);
//       window.removeEventListener("click", resetTimer);
//       window.removeEventListener("scroll", resetTimer);
//     };
//   }, []);

//   return null;
// }



"use client";

import { useEffect } from "react";

export default function AutoLogout({ type = "user" }) {
  // type can be "admin" or "user"
  useEffect(() => {
    let timer;

    const logoutNow = () => {
      if (type === "admin") {
        localStorage.removeItem("admintoken");
        document.cookie = "admintoken=; Max-Age=0";
        window.location.href = "/login";
      } else {
        localStorage.removeItem("usertoken");
        document.cookie = "usertoken=; Max-Age=0";
        window.location.href = "/"; // or your user login route
      }
    };

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(logoutNow, 15 * 60 * 1000); // 15 minutes
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);

    resetTimer();

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, [type]);

  return null;
}
