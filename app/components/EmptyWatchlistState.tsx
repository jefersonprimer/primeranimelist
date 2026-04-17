import Image from "next/image";
import Link from "next/link";

export function EmptyWatchlistState() {
  return (
    <div className="mt-10 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 shadow-2xl">
      <div className="grid gap-8 px-6 py-8 md:grid-cols-[280px_minmax(0,1fr)] md:items-center md:px-10">
        <div className="relative mx-auto w-full max-w-[260px]">
          <div className="absolute inset-0 rounded-3xl bg-indigo-500/15 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/70">
            <Image
              src="/rem-waiting.gif"
              alt="Rem waiting"
              width={520}
              height={520}
              unoptimized
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>

        <div className="text-center md:text-left">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-400">
            Watchlist vazia
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
            Nada salvo por aqui ainda
          </h2>
          <p className="mt-3 max-w-2xl text-base text-zinc-400">
            Quando você adicionar títulos à sua lista, eles vão aparecer aqui para acompanhar status, progresso e nota.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Voltar para a home
          </Link>
        </div>
      </div>
    </div>
  );
}
