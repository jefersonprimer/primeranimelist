"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import AlphabeticalClient from "./AlphabeticalClient";

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

interface Props {
  animes: AlphabeticalAnime[];
  activeLetter: string;
}

const AlphabeticalClientWrapper = ({ animes, activeLetter }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onLetterChange = useCallback(
    (letter: string) => {
      const params = new URLSearchParams(searchParams?.toString() || "");

      if (letter === "#") {
        params.delete("letter");
      } else {
        params.set("letter", letter);
      }

      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams],
  );

  return (
    <AlphabeticalClient
      animes={animes}
      activeLetter={activeLetter}
      onLetterChange={onLetterChange}
    />
  );
};

export default AlphabeticalClientWrapper;
