"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const nav = document.getElementById("floating-top-nav");
    if (!nav) return;

    if (selectedImage) {
      nav.style.opacity = "0";
      nav.style.visibility = "hidden";
    } else {
      nav.style.opacity = "1";
      nav.style.visibility = "visible";
    }
  }, [selectedImage]);

  const handleClose = () => {
    setSelectedImage(null);
    setScale(1); // Reset scale when closing
  };

  const zoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((prev) => Math.min(prev + 0.5, 4)); // Max 4x zoom
  };

  const zoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((prev) => Math.max(prev - 0.5, 0.5)); // Min 0.5x zoom
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="relative rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-[4/3] group shadow-sm border border-slate-200 dark:border-slate-800 cursor-pointer"
            onClick={() => setSelectedImage(img)}
          >
            <img
              src={img}
              alt={`Screenshot ${idx + 1}`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md" />
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8"
            onClick={handleClose}
          >
            {/* Top Toolbar */}
            <div className="absolute top-4 right-4 sm:top-8 sm:right-8 flex items-center gap-4 z-[101]">
              <div 
                className="flex items-center gap-2 bg-slate-800/80 rounded-full p-2 border border-slate-700 backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={zoomOut}
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-full transition-colors"
                  aria-label="Zoom Out"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <span className="text-slate-300 text-sm font-medium w-12 text-center">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-full transition-colors"
                  aria-label="Zoom In"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={handleClose}
                className="p-3 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full transition-colors border border-slate-700 backdrop-blur-sm"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Image Container */}
            <div className="relative w-full h-full flex items-center justify-center overflow-auto rounded-2xl">
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: scale, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                src={selectedImage}
                alt="Fullscreen View"
                className="max-w-full max-h-full object-contain cursor-grab active:cursor-grabbing origin-center"
                style={{ 
                  transformOrigin: "center",
                }}
                onClick={(e) => e.stopPropagation()} // Prevent bubbling up to close overlay
                drag
                dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }} // Allow dragging when zoomed
              />
            </div>
            
            <p className="absolute bottom-6 text-slate-400 text-sm bg-slate-800/60 px-4 py-2 rounded-full backdrop-blur-sm pointer-events-none">
              Click background to close &bull; Drag to pan when zoomed
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
