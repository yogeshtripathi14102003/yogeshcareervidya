"use client";

import { Phone } from "lucide-react";

export default function TalkToUniversity({
  open,
  onClose,
  universityName,
  phone = "+9193199 98717",
  whatsapp = "+9193199 98717",
}) {
  if (!open) return null;

  const userMessage = encodeURIComponent(
    `Hello! I am interested in ${universityName}.`
  );

  const handleWhatsApp = () => {
    const cleanNumber = whatsapp.replace(/\D/g, "");
    const link = `https://wa.me/${cleanNumber}?text=${userMessage}`;
    window.open(link, "_blank");
    onClose();
  };

  const handleCall = () => {
    window.location.href = `tel:${phone}`;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative animate-fadeIn">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
        >
          ×
        </button>

        {/* Header */}
        <h2 className="text-xl font-bold text-[#0B3C7A] mb-1">
          Talk to {universityName}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Connect instantly with our admission experts
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4">

          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsApp}
            className="
              flex items-center justify-center gap-3
              bg-[#25D366]
              text-white py-3 rounded-xl font-semibold
              shadow-md
              hover:bg-[#1ebe5d]
              hover:shadow-lg
              transition-all
            "
          >
            {/* Official WhatsApp SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              width="22"
              height="22"
              fill="white"
            >
              <path d="M16 0C7.163 0 0 7.163 0 16c0 2.825.738 5.607 2.136 8.058L0 32l8.196-2.101A15.94 15.94 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.091a13.06 13.06 0 0 1-6.661-1.832l-.478-.285-4.866 1.247 1.298-4.738-.312-.488A13.04 13.04 0 1 1 16 29.091zm7.558-9.887c-.413-.206-2.444-1.206-2.824-1.344-.38-.138-.656-.206-.931.206-.275.413-1.069 1.344-1.312 1.62-.243.275-.482.31-.895.103-.413-.206-1.744-.642-3.323-2.047-1.229-1.095-2.059-2.447-2.302-2.86-.243-.413-.026-.636.182-.843.186-.185.413-.482.62-.724.206-.243.275-.413.413-.689.138-.275.069-.517-.034-.724-.103-.206-.931-2.239-1.275-3.068-.335-.805-.676-.695-.931-.707l-.793-.014c-.275 0-.724.103-1.103.517-.38.413-1.447 1.413-1.447 3.447s1.482 3.999 1.689 4.275c.206.275 2.915 4.451 7.066 6.237.988.426 1.76.68 2.361.87.992.315 1.895.27 2.609.164.796-.119 2.444-.999 2.791-1.964.344-.965.344-1.793.241-1.964-.103-.172-.38-.275-.793-.482z" />
            </svg>
            WhatsApp Chat
          </button>

          {/* Call Button */}
          <button
            onClick={handleCall}
            className="
              flex items-center justify-center gap-3
              bg-[#0B3C7A]
              text-white py-3 rounded-xl font-semibold
              shadow-md
              hover:bg-[#092f60]
              hover:shadow-lg
              transition-all
            "
          >
            <Phone size={20} /> Call Now
          </button>
        </div>
      </div>
    </div>
  );
}
