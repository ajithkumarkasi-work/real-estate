import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export default function PropertyGallery({
  images,
  title,
}: PropertyGalleryProps) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const next = () => setIndex((value) => (value + 1) % images.length);
  const previous = () =>
    setIndex((value) => (value - 1 + images.length) % images.length);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!open) return;
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <div className="space-y-3">
        <div className="grid gap-3 lg:grid-cols-[2fr_1fr]">
          <div className="relative overflow-hidden rounded-3xl border bg-slate-100">
            <button
              aria-label="Previous image"
              onClick={previous}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/95 p-2 text-slate-900 shadow transition hover:bg-white dark:bg-slate-900/95 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              aria-label="Next image"
              onClick={next}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/95 p-2 text-slate-900 shadow transition hover:bg-white dark:bg-slate-900/95 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              aria-label="Open fullscreen gallery"
              onClick={() => setOpen(true)}
              className="block w-full"
            >
              <img
                src={images[index]}
                alt={title}
                className="aspect-[16/10] w-full object-cover"
              />
            </button>
            <div className="absolute bottom-4 left-4 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              {index + 1} / {images.length}
            </div>
          </div>

          <div className="hidden grid-cols-1 gap-3 lg:grid">
            {images.slice(0, 3).map((image, thumbIndex) => (
              <button
                key={`${image}-${thumbIndex}`}
                onClick={() => setIndex(thumbIndex)}
                className={`overflow-hidden rounded-2xl border transition ${
                  index === thumbIndex
                    ? "border-brand ring-2 ring-brand/40"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <img
                  src={image}
                  alt={`${title} thumbnail ${thumbIndex + 1}`}
                  className="h-[120px] w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 lg:hidden">
          {images.slice(0, 4).map((image, thumbIndex) => (
            <button
              key={`${image}-mobile-${thumbIndex}`}
              onClick={() => setIndex(thumbIndex)}
              className={`overflow-hidden rounded-2xl border transition ${
                index === thumbIndex
                  ? "border-brand ring-2 ring-brand/40"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              <img
                src={image}
                alt={`${title} thumbnail ${thumbIndex + 1}`}
                className="h-20 w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[90vh] max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={images[index]}
              alt={title}
              className="max-h-[80vh] w-full object-contain"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
