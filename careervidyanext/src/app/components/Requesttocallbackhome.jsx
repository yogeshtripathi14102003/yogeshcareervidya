"use client";

import { useState } from "react";
import Image from "next/image";
import RequestCallbackForm from "@/app/components/RequestCallbackForm";

export default function CantFindGuidance() {
  const [openCallback, setOpenCallback] = useState(false);

  return (
    <>
      {/* CALLBACK SECTION */}
      <section className="w-full bg-white py-4 sm:py-5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* CALLBACK BANNER — soft 3-color gradient */}
          <div
            className="w-full p-[4px] shadow-[0_5px_18px_rgba(0,0,0,0.08)]"
            style={{
              background:
                "linear-gradient(90deg, #EFF6FF 0%, #FFFFFF 50%, #FFF7ED 100%)",
            }}
          >
            {/* INNER BORDER — neutral */}
            <div
              className="
                w-full
                border-2
                px-5
                py-4
                sm:px-7
                sm:py-5
                md:px-9
                md:py-5
              "
              style={{ borderColor: "#E5E7EB" }}
            >
              <div
                className="
                  flex
                  flex-col
                  items-center
                  justify-between
                  gap-4
                  md:flex-row
                "
              >
                {/* LEFT CONTENT */}
                <div className="flex-1 text-center md:text-left">
                  {/* ✅ HEADING — Dark navy (NOT black) */}
                  <h2
                    className="
                      mb-1
                      text-lg
                      font-bold
                      leading-tight
                      sm:text-xl
                      md:text-[22px]
                    "
                    style={{ color: "#1E3A8A" }}
                  >
                    Can't find right guidance?
                  </h2>

                  {/* ✅ SUBTEXT — Neutral mid grey */}
                  <p
                    className="
                      mb-3
                      text-xs
                      leading-relaxed
                      sm:text-sm
                    "
                    style={{ color: "#64748B" }}
                  >
                    No Problem! Speak to our experts safely from your home.
                  </p>

                  {/* ✅ CAREERVIDYA GRADIENT BUTTON */}
                  <button
                    type="button"
                    onClick={() => setOpenCallback(true)}
                    className="
                      inline-flex
                      items-center
                      justify-center
                      rounded-md
                      cursor-pointer
                      px-6
                      py-2.5
                      text-xs
                      font-semibold
                      text-white
                      shadow-sm
                      transition-all
                      duration-300
                      hover:shadow-md
                      active:scale-95
                      sm:px-7
                      sm:py-2.5
                      sm:text-sm
                    "
                    style={{
                      background: "linear-gradient(180deg, #ec7425, #c15304)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "linear-gradient(180deg, #c15304, #a34203)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "linear-gradient(180deg, #ec7425, #c15304)";
                    }}
                  >
                    Request a Call Back
                  </button>
                </div>

                {/* RIGHT IMAGE */}
                <div
                  className="
                    flex
                    w-full
                    flex-shrink-0
                    items-center
                    justify-center
                    md:w-[250px]
                    lg:w-[290px]
                  "
                >
                  <Image
                    src="/images/reqCall.png"
                    alt="Career guidance and counselling"
                    width={400}
                    height={200}
                    className="
                      h-auto
                      w-[180px]
                      object-contain
                      sm:w-[210px]
                      md:w-[240px]
                      lg:w-[270px]
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALLBACK POPUP */}
      <RequestCallbackForm
        isOpen={openCallback}
        onClose={() => setOpenCallback(false)}
      />
    </>
  );
}