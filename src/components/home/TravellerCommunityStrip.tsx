import { ArrowRight, Camera } from "lucide-react";

export function TravellerCommunityStrip() {
  const communityPhotos = [
    {
      id: "p1",
      url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
      location: "Bali, Indonesia",
      caption: "@priya.travels in Ubud",
    },
    {
      id: "p2",
      url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80",
      location: "Dubai Marina",
      caption: "@rohan_m sunset yacht",
    },
    {
      id: "p3",
      url: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=600&q=80",
      location: "Dal Lake, Kashmir",
      caption: "@siddharth_v Dal Lake Shikara",
    },
    {
      id: "p4",
      url: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80",
      location: "Paris, France",
      caption: "@vikram.kapoor Seine cruise",
    },
    {
      id: "p5",
      url: "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=600&q=80",
      location: "Phi Phi, Thailand",
      caption: "@ananya_island turquoise lagoons",
    },
  ];

  return (
    <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      {/* Section Header (Left-aligned) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 text-left">
        <div className="max-w-2xl">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] tracking-tight leading-[1.12]">
            Memories made. Stories shared.
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#52525B] mt-2 font-normal">
            Real photos from our travellers (with consent).
          </p>
        </div>

        {/* Far Right Bold Link */}
        <a
          href="https://instagram.com/tripmasterluxury"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-heading font-bold uppercase tracking-wider text-[#0D2C24] hover:text-[#133E33] inline-flex items-center gap-2 group self-start sm:self-end pb-1"
        >
          <svg
            className="w-4 h-4 text-amber-600 fill-current"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          <span>Follow Our Travel Community</span>
          <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      {/* 5 Rounded Traveller Memory Photo Thumbnails Side-by-Side */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {communityPhotos.map((photo) => (
          <div
            key={photo.id}
            className="group relative aspect-square rounded-2xl overflow-hidden shadow-card border border-[#E4E2DD] bg-[#F3F1ED]"
          >
            <img
              src={photo.url}
              alt={photo.location}
              className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white" />
            <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-[10px] uppercase font-bold text-amber-300 block">
                {photo.location}
              </span>
              <span className="text-xs font-medium block truncate">
                {photo.caption}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
