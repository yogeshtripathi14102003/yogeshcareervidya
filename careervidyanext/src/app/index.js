"use client";

import QueryPopup from "./components/QueryPopup";



export default function Home() {
  return (
    <main>
      <section className="p-10 text-center">
        <h1 className="text-3xl font-bold">Welcome to Career Vidya</h1>
        <p className="text-gray-600 mt-2">Empowering your future</p>
      </section>

      {/* 👇 Popup appears 5 seconds after every refresh */}
      <QueryPopup />
    </main>
  );
}
