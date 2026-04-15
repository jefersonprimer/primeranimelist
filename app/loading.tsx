"use client"

import Image from "next/image"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] overflow-hidden">
      {/* Background Cyberpunk Grid */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      
      {/* Radiant Glows */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyber-pink/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyber-cyan/20 rounded-full blur-[120px]" />

      <div className="relative flex flex-col items-center gap-8">
        {/* Character Container - Cartoonish Style */}
        <div className="relative p-2 bg-black cyber-border comic-shadow-pink rounded-xl overflow-hidden">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64">
            <Image
              src="/nezuko-kamado-run.gif"
              alt="Nezuko Running"
              fill
              className="object-contain"
              priority
              unoptimized
            />
          </div>
          
          {/* Cyberpunk "Sticker" accents */}
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-cyber-cyan text-black text-[10px] font-black uppercase tracking-widest -rotate-2">
            System.Run()
          </div>
          <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-cyber-yellow text-black text-[10px] font-black uppercase tracking-widest rotate-3">
            Loading...
          </div>
        </div>

        {/* Minimalist Progress Bar */}
        <div className="w-64 h-2 bg-zinc-900 border-2 border-black rounded-full overflow-hidden shadow-[0_0_15px_rgba(255,0,255,0.3)]">
          <div className="h-full bg-gradient-to-r from-cyber-pink via-cyber-cyan to-cyber-yellow animate-[loading-bar_2s_ease-in-out_infinite] origin-left" />
        </div>

        {/* Text with Glitch/Neon Effect */}
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-xl font-black text-white uppercase tracking-[0.2em] neon-text-cyan animate-pulse">
            Sincronizando
          </h2>
          <span className="text-[10px] font-mono text-cyber-pink uppercase tracking-[0.5em] animate-glitch">
            Protocolo: PAL-Anime
          </span>
        </div>
      </div>

      {/* Decorative Speed Lines */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[speedline_1.5s_linear_infinite]"
            style={{
              top: `${15 + i * 15}%`,
              left: '-20%',
              width: `${20 + Math.random() * 30}%`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>

      <style jsx global>{`
        @keyframes loading-bar {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); }
        }

        @keyframes speedline {
          0% { transform: translateX(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(120vw); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
