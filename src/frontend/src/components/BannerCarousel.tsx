import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { OfferBanner } from "../backend.d";

interface BannerCarouselProps {
  banners: OfferBanner[];
}

export default function BannerCarousel({ banners }: BannerCarouselProps) {
  const [current, setCurrent] = useState(0);

  const activeBanners = banners.filter((b) => b.active);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeBanners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const banner = activeBanners[current];

  const bgGradients = [
    "from-amber-700 to-amber-900",
    "from-green-700 to-green-900",
    "from-stone-600 to-stone-800",
  ];

  const bgGrad = bgGradients[current % bgGradients.length];

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-jute">
      <AnimatePresence mode="wait">
        <motion.div
          key={banner.id.toString()}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.4 }}
          className={`bg-gradient-to-r ${bgGrad} text-white px-6 py-5 flex items-center justify-between gap-4`}
        >
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <Zap className="h-6 w-6 text-yellow-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg leading-snug">
                  {banner.title}
                </h3>
                {Number(banner.discountPercent) > 0 && (
                  <span className="bg-yellow-400 text-yellow-900 text-xs font-ui font-bold px-2 py-0.5 rounded-full">
                    {banner.discountPercent.toString()}% OFF
                  </span>
                )}
              </div>
              <p className="text-white/80 text-sm mt-0.5">
                {banner.description}
              </p>
            </div>
          </div>

          {/* Navigation */}
          {activeBanners.length > 1 && (
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setCurrent(
                    (prev) =>
                      (prev - 1 + activeBanners.length) % activeBanners.length,
                  )
                }
                className="h-7 w-7 p-0 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex gap-1">
                {activeBanners.map((banner, i) => (
                  <button
                    key={banner.id.toString()}
                    type="button"
                    onClick={() => setCurrent(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === current ? "w-4 bg-white" : "w-1.5 bg-white/40"
                    }`}
                  />
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setCurrent((prev) => (prev + 1) % activeBanners.length)
                }
                className="h-7 w-7 p-0 text-white hover:bg-white/20"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
