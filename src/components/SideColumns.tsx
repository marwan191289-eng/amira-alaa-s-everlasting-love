// Two thin scrolling photo columns fixed to the page edges.
// Right column moves bottom→top, left column moves top→bottom (opposite).
// Hidden on small screens to keep the mobile layout clean.

interface Props {
  images: string[];
}

export function SideColumns({ images }: Props) {
  if (!images.length) return null;
  // Duplicate for seamless loop
  const loop = [...images, ...images];

  return (
    <>
      {/* RIGHT column — moves UP */}
      <div
        className="pointer-events-none fixed top-0 right-0 z-10 hidden h-screen w-24 overflow-hidden lg:block xl:w-28"
        aria-hidden="true"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div className="flex flex-col gap-3 animate-marquee-up">
          {loop.map((src, i) => (
            <img
              key={"r" + i}
              src={src}
              alt=""
              className="w-full rounded-xl border border-gold/30 object-cover shadow-elegant"
              style={{ aspectRatio: "3 / 4" }}
              loading="lazy"
            />
          ))}
        </div>
      </div>

      {/* LEFT column — moves DOWN */}
      <div
        className="pointer-events-none fixed top-0 left-0 z-10 hidden h-screen w-24 overflow-hidden lg:block xl:w-28"
        aria-hidden="true"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div className="flex flex-col gap-3 animate-marquee-down">
          {loop.map((src, i) => (
            <img
              key={"l" + i}
              src={src}
              alt=""
              className="w-full rounded-xl border border-gold/30 object-cover shadow-elegant"
              style={{ aspectRatio: "3 / 4" }}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </>
  );
}
