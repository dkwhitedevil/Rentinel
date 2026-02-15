import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const neobrutalShadow = "6px 6px 0 #005060";
const neobrutalBorder = "4px solid #002040";

export default function ListingHero({ listing }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = listing?.images || [];
  const len = images.length;

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i <= 0 ? len - 1 : i - 1));
  }, [len]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i >= len - 1 ? 0 : i + 1));
  }, [len]);

  const handleSwipe = useCallback(
    (dir) => {
      if (dir > 0) goPrev();
      else goNext();
    },
    [goPrev, goNext]
  );

  return (
    <section className="mb-6">
      <div
        className="relative overflow-hidden rounded-none bg-[#002040]"
        style={{ border: neobrutalBorder, boxShadow: neobrutalShadow }}
      >
        {/* Image gallery */}
        <div className="relative aspect-[16/10] md:aspect-[21/9] select-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 50) handleSwipe(info.offset.x);
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
            >
              <img
                src={images[activeIndex] || images[0]}
                alt={`${listing?.fullTitle || "Listing"} - photo ${activeIndex + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                draggable={false}
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23002040'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%23002040'%3EListing Photo%3C/text%3E%3C/svg%3E";
                }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Overlay gradient + text */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"
            aria-hidden
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 pointer-events-none">
            <p className="text-white font-bold text-lg md:text-2xl drop-shadow-lg">
              {listing?.title || listing?.fullTitle || "Rental Listing"}
            </p>
            <p className="text-white/90 text-sm mt-1">
              Transparency begins before you apply.
            </p>
          </div>

          {/* Trust score badge */}
          {listing?.trustScore != null && (
            <div
              className="absolute top-3 right-3 px-3 py-1.5 bg-white border-2 border-[#002040] font-bold text-[#002040] text-sm"
              style={{ boxShadow: "3px 3px 0 #005060" }}
            >
              Landlord Trust Score: {listing.trustScore}%
            </div>
          )}

          {/* Navigation arrows - desktop */}
          {len > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center bg-white/90 border-2 border-[#002040] hover:bg-white transition"
                style={{ boxShadow: "3px 3px 0 #005060" }}
                aria-label="Previous photo"
              >
                ←
              </button>
              <button
                type="button"
                onClick={goNext}
                className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center bg-white/90 border-2 border-[#002040] hover:bg-white transition"
                style={{ boxShadow: "3px 3px 0 #005060" }}
                aria-label="Next photo"
              >
                →
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {len > 1 && (
          <div className="absolute bottom-4 left-4 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`w-2 h-2 rounded-full transition ${
                  i === activeIndex ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Trust sentence under gallery */}
        {listing?.trustLabel && (
          <p className="px-4 py-2 bg-[#F0F0F0] text-sm text-[#002040]/80 border-t-2 border-[#002040]">
            “{listing.trustLabel}”
          </p>
        )}
      </div>
    </section>
  );
}
