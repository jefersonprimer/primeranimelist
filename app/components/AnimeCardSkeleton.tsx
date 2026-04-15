export function AnimeCardSkeleton() {
  return (
    <div className="relative block w-full overflow-hidden h-[340px] sm:h-[380px]">
      <div className="relative h-[82%] w-full overflow-hidden shadow-md bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
      
      <div className="py-2 h-[18%] flex flex-col gap-2">
        <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
        <div className="h-4 w-2/3 bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
      </div>
    </div>
  );
}
