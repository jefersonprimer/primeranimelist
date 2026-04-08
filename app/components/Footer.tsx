import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-white dark:bg-black border-t border-zinc-200 dark:border-zinc-800 mt-auto py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-zinc-600 dark:text-zinc-400">
                {/* Branding Section */}
                <div className="flex flex-col gap-4">
                    <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        PrimerAnimeList
                    </Link>
                    <p className="text-sm leading-relaxed max-w-xs">
                        Your professional destination for tracking and discovering the best of anime and manga. Powered by the Jikan API.
                    </p>
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-300">
                        By <span className="font-bold">PrimerLabs</span>
                    </div>
                </div>

                {/* Anime Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider text-xs">Anime</h3>
                    <ul className="flex flex-col gap-2 text-sm">
                        <li>
                            <Link href="/anime/top" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                                Top Anime
                            </Link>
                        </li>
                        <li>
                            <Link href="/anime/season" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                                Seasonal Anime
                            </Link>
                        </li>
                        <li>
                            <Link href="/anime/top?filter=upcoming" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                                Upcoming
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Manga Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider text-xs">Manga</h3>
                    <ul className="flex flex-col gap-2 text-sm">
                        <li>
                            <Link href="/manga/top" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                                Top Manga
                            </Link>
                        </li>
                        <li>
                            <Link href="/manga/top?type=manga" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                                Manga List
                            </Link>
                        </li>
                        <li>
                            <Link href="/manga/top?type=manhwa" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                                Manhwa
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Company/Legal */}
                <div className="flex flex-col gap-4">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider text-xs">PrimerLabs</h3>
                    <ul className="flex flex-col gap-2 text-sm">
                        <li>
                            <Link href="/about" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link href="/api" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                                API Docs
                            </Link>
                        </li>
                        <li>
                            <a href="https://github.com/primerlabs" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                                Open Source
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
                <p>
                    © {currentYear} PrimerAnimeList. All rights reserved.
                </p>
                <div className="flex gap-6">
                    <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                        Privacy Policy
                    </Link>
                    <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                        Terms of Service
                    </Link>
                </div>
                <p className="font-medium text-zinc-600 dark:text-zinc-400">
                    Designed and Developed by <span className="text-zinc-900 dark:text-zinc-50 font-semibold">PrimerLabs</span>
                </p>
            </div>
        </footer>
    );
}