import Link from "next/link";
import Image from "next/image";
import { ArrowBigLeftIcon } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-50 px-6 py-24 dark:bg-zinc-950">
      {/* Background Pattern - Halftone style from MangaCarousel */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px] dark:opacity-[0.05]" />
      
      {/* Cyberpunk Glitch Accents */}
      <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px] dark:bg-indigo-500/10" />
      <div className="absolute bottom-[-10%] right-[-10%] h-96 w-96 rounded-full bg-rose-600/10 blur-[120px] dark:bg-rose-500/10" />

      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-12 md:flex-row md:justify-center">
        
        {/* Left Side: Komi-san Icon */}
        <div className="relative group">
          {/* Animated background shape */}
          <div className="absolute -inset-4 rotate-3 bg-indigo-600 opacity-20 transition-transform group-hover:-rotate-3" />
          
          <div className="relative border-4 border-zinc-900 bg-white p-2 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all group-hover:translate-x-[-4px] group-hover:translate-y-[-4px] group-hover:shadow-[16px_16px_0px_0px_rgba(79,70,229,0.4)] dark:border-white dark:bg-zinc-900 dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)]">
            <div className="relative h-[250px] w-[250px] overflow-hidden sm:h-[350px] sm:w-[350px]">
              <Image
                src="/komi-komi-san.gif"
                alt="Komi-san 404"
                fill
                className="object-cover"
                unoptimized
                priority
              />
              {/* Halftone Overlay */}
              <div className="pointer-events-none absolute inset-0 z-10 mix-blend-multiply opacity-10 dark:mix-blend-screen bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:4px_4px]" />
            </div>
            
            {/* Manga Caption Tag */}
            <div className="absolute -bottom-4 -right-4 bg-zinc-900 px-4 py-2 text-xs font-black uppercase tracking-tighter text-white dark:bg-white dark:text-black">
              Silence is 404
            </div>
          </div>
        </div>

        {/* Right Side: 404 Title and Button */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <div className="relative mb-6">
            <span className="mb-2 block text-[12px] font-black uppercase tracking-[0.4em] text-indigo-600 dark:text-indigo-400">
              Error Connection Lost
            </span>
            <h1 className="text-6xl font-black leading-none tracking-tighter text-zinc-900 dark:text-zinc-50 md:text-8xl italic uppercase">
              404 <br />
              <span className="text-indigo-600 dark:text-indigo-400">Page Not</span> <br />
              Found
            </h1>
            
            {/* Decorative bars */}
            <div className="mt-8 flex gap-2">
              <div className="h-3 w-20 bg-zinc-900 dark:bg-white shadow-[4px_4px_0px_0px_rgba(79,70,229,0.6)]" />
              <div className="h-3 w-8 bg-indigo-600" />
              <div className="h-3 w-4 bg-zinc-300 dark:bg-zinc-700" />
            </div>
          </div>

          <p className="mb-10 max-w-md text-lg font-bold italic text-zinc-500 dark:text-zinc-400">
            It seems you've wandered into a quiet corner of the database. Even Komi-san doesn't know what to say about this.
          </p>

          <Link
            href="/"
            className="group relative inline-flex items-center gap-4 bg-zinc-900 px-10 py-5 text-sm font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-indigo-600 hover:shadow-none shadow-[8px_8px_0px_0px_rgba(79,70,229,1)] active:translate-x-1 active:translate-y-1 dark:bg-white dark:text-black dark:hover:bg-indigo-500 dark:hover:text-white"
          >
            <ArrowBigLeftIcon className="transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Footer Text Accent */}
      <div className="absolute bottom-8 left-0 flex w-full items-center justify-center opacity-20">
          <span className="text-[8vw] font-black uppercase tracking-tighter text-zinc-200 dark:text-zinc-800 pointer-events-none select-none italic leading-none">
            NOT FOUND NOT FOUND NOT FOUND
          </span>
      </div>
    </main>
  );
}
