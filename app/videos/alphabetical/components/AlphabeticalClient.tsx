import SortDropdown from "@/app/videos/components/SortDropdown";
import AnimeCard from "./AnimeCard";

type AlphabeticalAnime = {
  id: number;
  malId: number;
  title: string;
  imageUrl: string | null;
  imageCardCompact: string | null;
  rating: string | null;
  score: number | null;
  episodes: number | null;
  synopsis: string | null;
  members: number | null;
};

interface AlphabeticalClientProps {
  animes: AlphabeticalAnime[];
  activeLetter: string;
  onLetterChange?: (letter: string) => void;
}

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const AlphabeticalClient = ({
  animes,
  activeLetter,
  onLetterChange,
}: AlphabeticalClientProps) => {
  return (
    <div className="mx-auto flex w-full max-w-[1130px] flex-col items-center px-6 py-15">
      <div className="mb-8 px-2 flex w-full items-center justify-between">
        <h1 className="m-0 p-0 text-[28px] font-bold font-lato text-left">
          Alphabetical
        </h1>
        <div className="flex items-center">
          <SortDropdown currentLabel="Alphabetical" className="ml-4" />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap justify-center gap-2">
        <button
          className={`rounded p-2.5 transition-transform ${
            activeLetter === "#" ? "scale-110 text-[#FF640A]" : "text-[#A0A0A0]"
          } hover:scale-110`}
          onClick={() => onLetterChange?.("#")}
          type="button"
        >
          #
        </button>
        {letters.map((letter) => (
          <button
            key={letter}
            className={`rounded p-2.5 transition-transform ${
              activeLetter === letter
                ? "scale-110 text-[#FF640A]"
                : "text-[#A0A0A0]"
            } hover:scale-110 hover:cursor-pointer hover:text-white`}
            onClick={() => onLetterChange?.(letter)}
            type="button"
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="flex w-full flex-col gap-4">
        {animes.length > 0 ? (
          animes.map((anime) => <AnimeCard key={anime.id} anime={anime} />)
        ) : (
          <p className="py-8 text-center text-zinc-400">
            No anime found for &quot;{activeLetter}&quot;.
          </p>
        )}
      </div>
    </div>
  );
};

export default AlphabeticalClient;
