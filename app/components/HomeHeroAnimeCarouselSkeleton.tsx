export function HomeHeroAnimeCarouselSkeleton() {
  return (
    <section className="relative z-0 w-full">
      <div className="mx-auto">
        <div className="relative h-[90vh] min-h-[520px] w-full overflow-hidden bg-zinc-900">
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/30" />

          <div className="absolute -translate-y-20 inset-0 flex items-center mx-auto w-full max-w-7xl p-8 sm:py-10 md:py-12">
            <div className="max-w-md w-full">
              {/* Logo/Title skeleton */}
              <div className="mb-6 h-24 w-[280px] sm:h-28 sm:w-[340px] bg-zinc-800 animate-pulse rounded" />

              {/* Rating and Genres skeleton */}
              <div className="mb-4 flex items-center gap-2">
                <div className="h-5 w-5 bg-zinc-800 animate-pulse rounded-full" />
                <div className="h-4 w-48 bg-zinc-800 animate-pulse rounded" />
              </div>

              {/* Synopsis skeleton */}
              <div className="space-y-3 mb-8">
                <div className="h-4 w-full bg-zinc-800 animate-pulse rounded" />
                <div className="h-4 w-full bg-zinc-800 animate-pulse rounded" />
                <div className="h-4 w-full bg-zinc-800 animate-pulse rounded" />
                <div className="h-4 w-2/3 bg-zinc-800 animate-pulse rounded" />
              </div>

              {/* Buttons skeleton */}
              <div className="mt-5 mb-12 flex items-center gap-2">
                <div className="h-10 w-44 bg-zinc-800 animate-pulse rounded" />
                <div className="h-10 w-10 bg-zinc-800 animate-pulse rounded" />
              </div>

              {/* Dots skeleton */}
              <div className="mt-4 flex items-center gap-2">
                <div className="h-1.5 w-10 bg-zinc-800 animate-pulse rounded-full" />
                <div className="h-1.5 w-5 bg-zinc-800 animate-pulse rounded-full" />
                <div className="h-1.5 w-5 bg-zinc-800 animate-pulse rounded-full" />
                <div className="h-1.5 w-5 bg-zinc-800 animate-pulse rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
