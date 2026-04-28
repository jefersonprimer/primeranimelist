"use client";
import React, { useState, useEffect } from "react";
import type { Anime } from "@/types/anime";
import AnimeCarouselGenre from "../../../../components/carousel/AnimeCarouselGenre";
import AudioDropdown from "./AudioDropdown";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface GenreInfo {
  en: string;
  pt: string;
}

type AudioFilter = "subtitled_dubbed" | "subtitled" | "dubbed";

interface Props {
  animes: Anime[];
  genre: string;
  genreInfo?: GenreInfo;
  error?: any;
  audioFilter: AudioFilter;
}

export default function GenreNewClient({
  animes,
  genre,
  genreInfo,
  error,
  audioFilter: initialAudioFilter,
}: Props) {
  const t = useTranslations("genre.genreNewPage");
  const [audioFilter, setAudioFilter] =
    useState<AudioFilter>(initialAudioFilter);
  const [filteredAnimes, setFilteredAnimes] = useState<Anime[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Atualiza a URL ao trocar o filtro
  const handleAudioFilter = (filter: AudioFilter) => {
    setAudioFilter(filter);
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (filter === "subtitled_dubbed") {
      params.delete("lang");
    } else {
      params.set("lang", filter);
    }
    router.replace(
      `${pathname}${params.toString() ? `?${params.toString()}` : ""}`,
    );
  };

  useEffect(() => {
    if (animes && genreInfo) {
      let filtered = animes.filter((anime: Anime) =>
        anime.genres?.some((g: any) => g.name === genreInfo.en),
      );
      if (audioFilter !== "subtitled_dubbed") {
        filtered = filtered.filter((anime: Anime) => {
          if (audioFilter === "dubbed") {
            return (
              anime.audioType === "dubbed" ||
              anime.audioType === "subtitled_dubbed"
            );
          }
          return anime.audioType === audioFilter;
        });
      }
      setFilteredAnimes(filtered);
    }
  }, [animes, audioFilter, genreInfo]);

  if (!genreInfo) {
    return <p>{t("genreNotFound", { genre })}</p>;
  }
  if (error) return <p>{t("error", { error: error.message })}</p>;

  return (
    <>
      <div className="px-8 py-8 max-w-full mx-auto w-[1066px] my-0 mb-8">
        <div className="flex justify-between items-center mb-8">
          {/* Título principal */}
          <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
            {t("titlePage", { genre: genreInfo.pt })}
          </h1>

          {/* Filtros */}
          <AudioDropdown
            audioFilter={audioFilter}
            onChange={(filter) => handleAudioFilter(filter as AudioFilter)}
          />
        </div>
        {/* Carrossel de animes */}
        <AnimeCarouselGenre animes={filteredAnimes} />
      </div>
    </>
  );
}
