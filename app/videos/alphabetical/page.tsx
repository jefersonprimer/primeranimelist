import { listAlphabeticalAnime } from "@/lib/services/anime.service";
import AlphabeticalClientWrapper from "./components/AlphabeticalClientWrapper";

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata() {
  return {
    title: "Alphabetical Order",
    description: "Browse anime in alphabetical order.",
  };
}

export default async function AlphabeticalPage({
  searchParams,
}: {
  searchParams: Promise<{ letter?: string | string[] }>;
}) {
  const params = await searchParams;
  const requestedLetter = getSingleValue(params.letter);
  const result = await listAlphabeticalAnime({ letter: requestedLetter });

  return (
    <AlphabeticalClientWrapper
      animes={result.items}
      activeLetter={result.letter}
    />
  );
}
