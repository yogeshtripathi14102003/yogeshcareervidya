



// src/components/HeroSlider.jsx
// Server Component — fetches banners on server using API_URL (no NEXT_PUBLIC needed)

import { Suspense } from "react";
import HeroSliderClient from "../../components/slider/Herosliderclient.jsx";
import { serverFetch } from "@/utlis/serverFetch";

export default async function HeroSlider() {
  let banners = [];
 
  try {
    const res = await serverFetch("/api/v1/banner/active?position=HERO", {
      next: { revalidate: 300 }, // ISR: re-fetch every 5 minutes
    });
 
    if (res.ok) {
      const data = await res.json();
      banners = data || [];
    }
  } catch (err) {
    console.error("HeroSlider: banner fetch failed →", err);
  }
 
  // Banners already fetched on server — client gets data instantly, zero flash
  return <HeroSliderClient initialBanners={banners} />;
}
 