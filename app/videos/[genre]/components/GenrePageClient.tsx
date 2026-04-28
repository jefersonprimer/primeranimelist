"use client";

import AnimeCarouselGenre from "@/app/components/AnimeCarouselGenre";

interface Genre {
  id: string;
  name: string;
}

interface Anime {
  id: string;
  slug: string;
  name: string;
  audioType?: string;
  imagePoster?: string;
  imageCardCompact?: string;
  genres?: Genre[];
  isPopular: boolean;
  isNewRelease: boolean;
}

const genreMapping: Record<string, { en: string; pt: string }> = {
  action: { en: "Action", pt: "Ação" },
  adventure: { en: "Adventure", pt: "Aventura" },
  comedy: { en: "Comedy", pt: "Comédia" },
  drama: { en: "Drama", pt: "Drama" },
  fantasy: { en: "Fantasy", pt: "Fantasia" },
  historical: { en: "Historical", pt: "Histórico" },
  "post-apocalyptic": { en: "Post-Apocalyptic", pt: "Pós-Apocalíptico" },
  "sci-fi": { en: "Sci-Fi", pt: "Ficção Científica" },
  supernatural: { en: "Supernatural", pt: "Sobrenatural" },
  thriller: { en: "Thriller", pt: "Suspense" },
  romance: { en: "Romance", pt: "Romance" },
  shonen: { en: "Shonen", pt: "Shonen" },
  shojo: { en: "Shojo", pt: "Shojo" },
};

const genreDetails: Record<string, { img: string; description: string }> = {
  action: {
    img: "https://static.vrv.co/imgsrv/display/resize/72x72/categories/low_63eb67c0a58d9c2ae71e7afebcbbfa16.png",
    description: "Para quem quer sua dose diária de porradaria e explosões!",
  },
  adventure: {
    img: "https://static.vrv.co/imgsrv/display/resize/72x72/categories/low_4bd7f2bd2ff675823b77c671cf168c55.png",
    description: "Aventure-se com heróis galantes em busca de seus sonhos!",
  },
  comedy: {
    img: "https://static.vrv.co/imgsrv/display/resize/72x72/categories/low_5bec6e03550d84bcf412cb51e902d496.png",
    description:
      "Caia na gargalhada com piadas hilárias e com clássicos do humor!",
  },
  drama: {
    img: "https://static.vrv.co/imgsrv/display/resize/72x72/categories/low_82cedbb5de3071cdf0c466d76ee171c6.png",
    description: "É hora de mergulhar numa história cheia de sentimentos!",
  },
  fantasy: {
    img: "https://static.vrv.co/imgsrv/display/resize/72x72/categories/low_a8bd8432ca3d453db8f930d12bc65183.png",
    description:
      "Nem magia e nem monstros vão deter os aventureiros deste gênero!",
  },
  music: {
    img: "https://static.vrv.co/imgsrv/display/resize/72x72/categories/low_beac36ec0e13f32709972b3f32d32902.png",
    description:
      "Música clássica, rock, pop e um tiquinho assim de carimbó. Aumenta o volume e vem assistir!",
  },
  romance: {
    img: "https://static.vrv.co/imgsrv/display/resize/72x72/categories/low_86e998b3e41f6da3c10d0bbd9c3244fe.png",
    description:
      "Quer suspirar pelo amor perfeito e se afogar na sofrência? Esta é a categoria dos românticos.",
  },
  "sci-fi": {
    img: "https://static.vrv.co/imgsrv/display/resize/72x72/categories/low_0c621f0e87ebf5fac9e807e4195dacda.png",
    description:
      "Prepare-se para decolar e para hackear com estas séries high-tech!",
  },
  seinen: {
    img: "https://static.vrv.co/imgsrv/display/resize/72x72/categories/low_d997593cad00938fcd4a6fe3a8b4af09.png",
    description:
      "Se você está sentindo o peso da vida adulta, estes aqui podem lhe agradar.",
  },
  shojo: {
    img: "https://static.vrv.co/imgsrv/display/resize/72x72/categories/low_3acfb605e0e82bef863ad12787496e7f.png",
    description:
      "A primavera da juventude, o primeiro amor, e uma dose extra de alta costura. Essas garotas estão com tudo!",
  },
  shonen: {
    img: "https://static.vrv.co/imgsrv/display/resize/72x72/categories/low_b8c4545305b3c4e4a6ed8e631510a2bf.png",
    description:
      "Trabalho em equipe, o poder da amizade, a busca dos sonhos: o básico está todo aqui!",
  },
  "slice-of-life": {
    img: "https://static.vrv.co/imgsrv/display/resize/72x72/categories/low_5ff1210eb0099a6ab2fb55c88b43b822.png",
    description: "Devagar e sempre? É assim que eu gosto.",
  },
  sports: {
    img: "https://static.vrv.co/imgsrv/display/resize/72x72/categories/low_a073b4de6948709b51b15136ef78bc0c.png",
    description:
      "Vamos jogar bola! (ou praticar outra atividade física, como preferir)",
  },
  supernatural: {
    img: "https://static.vrv.co/imgsrv/display/resize/72x72/categories/low_2c7d96fe18edd30177f2e16828dde94c.png",
    description:
      "Fantasmas, demônios, espíritos, e todas as criaturas que assombram a noite!",
  },
  thriller: {
    img: "https://static.vrv.co/imgsrv/display/resize/72x72/categories/low_ebb3905f791ed81ae0ad85ee265f5dec.png",
    description:
      "Uma seleção de shows que vão te arrepiar e fazer você gritar com a TV: 'Não entre aí!'",
  },
};

export default function GenrePageClient({
  genre,
  messages,
}: {
  genre: string;
  messages: any;
}) {
  const genreInfo = genreMapping[genre];
  const details = genreDetails[genre];

  // Query para animes populares
  const {
    data: popularData,
    loading: popularLoading,
    error: popularError,
  } = useQuery(GET_POPULAR_ANIMES);
  // Query para animes novos
  const {
    data: newData,
    loading: newLoading,
    error: newError,
  } = useQuery(GET_LATEST_RELEASES);

  if (!genreInfo) {
    return (
      <p>
        {messages.genre?.genreNotFound?.replace("{genre}", genre) ||
          `Gênero não encontrado: ${genre}`}
      </p>
    );
  }

  //   if (popularLoading || newLoading) return <Loading/>;
  if (popularError)
    return (
      <p>
        {messages.genre?.error?.replace("{error}", popularError.message) ||
          popularError.message}
      </p>
    );
  if (newError)
    return (
      <p>
        {messages.genre?.error?.replace("{error}", newError.message) ||
          newError.message}
      </p>
    );

  const popularAnimes = popularData?.popularAnimes || [];
  const newAnimes = newData?.latestReleases || [];

  // Filtra os animes populares pelo gênero selecionado
  const filteredPopularAnimes = popularAnimes.filter((anime: Anime) =>
    anime.genres?.some((g: Genre) => g.name === genreInfo.en),
  );

  // Filtra os animes novos pelo gênero selecionado
  const filteredNewAnimes = newAnimes.filter((anime: Anime) =>
    anime.genres?.some((g: Genre) => g.name === genreInfo.en),
  );

  // Filtra os outros gêneros
  const otherGenresAnimes = Object.entries(genreMapping)
    .filter(([key]) => key !== genre)
    .map(([key, value]) => {
      const otherGenreAnimes = popularAnimes.filter((anime: Anime) =>
        anime.genres?.some((g: Genre) => g.name === value.en),
      );
      return { genre: value.pt, genreKey: key, animes: otherGenreAnimes };
    });

  return (
    <div className="flex w-[1351px] my-0 mx-auto flex-col items-center text-center py-8 pt-[60px] px-8">
      {/* Header do gênero */}
      <div className="flex flex-col items-center mb-8 w-full">
        <div className="flex items-center gap-2 mb-2">
          {details?.img && (
            <img
              className="w-8 h-8 rounded object-cover"
              src={details.img}
              alt={genreInfo?.pt}
            />
          )}
          <h1 className="text-3xl text-white font-medium">{genreInfo?.pt}</h1>
        </div>
        <p className="text-sm font-medium text-white">{details?.description}</p>
      </div>
      {/* AnimeCarousel para Populares do gênero */}
      {filteredPopularAnimes.length > 0 && (
        <div className="w-[1050px] my-0 mx-auto mb-8">
          <div className="flex justify-between items-center mb-4 gap-2.5">
            <h2 className="text-xl text-white font-semibold">
              {messages.genre?.popular}
            </h2>
            <Link
              href={`/videos/${genre}/popular`}
              className="flex justify-center items-center text-sm font-semibold text-[#A0A0A0] cursor-pointer uppercase hover:text-white"
            >
              <span>{messages.genre?.viewAll}</span>
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                data-t="angle-right-svg"
                aria-hidden="true"
                role="img"
                fill="currentColor"
              >
                <path d="M8.6 7.4L10 6l6 6-6 6-1.4-1.4 4.6-4.6z"></path>
              </svg>
            </Link>
          </div>
          <AnimeCarouselGenre animes={filteredPopularAnimes} />
        </div>
      )}
      {/* AnimeCarousel para Novidades do gênero */}
      {filteredNewAnimes.length > 0 && (
        <div className="w-[1050px] my-0 mx-auto mb-8">
          <div className="flex justify-between items-center mb-4 gap-2.5">
            <h2 className="text-xl text-white font-semibold">
              {messages.genre?.newReleases}
            </h2>
            <Link
              href={`/videos/${genre}/new`}
              className="flex justify-center items-center text-sm font-semibold text-[#A0A0A0] cursor-pointer uppercase hover:text-white"
            >
              <span>{messages.genre?.viewAll}</span>
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                data-t="angle-right-svg"
                aria-hidden="true"
                role="img"
                fill="currentColor"
              >
                <path d="M8.6 7.4L10 6l6 6-6 6-1.4-1.4 4.6-4.6z"></path>
              </svg>
            </Link>
          </div>
          <AnimeCarouselGenre animes={filteredNewAnimes} />
        </div>
      )}
      {/* AnimeCarousel para os outros gêneros */}
      <div className="w-[1050px] my-0 mx-auto">
        {otherGenresAnimes.map(({ genre, genreKey, animes }) => (
          <div key={genre} className="mb-8">
            <div className="flex justify-between items-center mb-4 gap-2.5">
              <h2 className="text-xl text-white font-semibold">{genre}</h2>
              <Link
                href={`/videos/${genreKey}`}
                className="flex justify-center items-center text-sm font-semibold text-[#A0A0A0] cursor-pointer uppercase hover:text-white"
              >
                <span>{messages.genre?.viewAll}</span>
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  data-t="angle-right-svg"
                  aria-hidden="true"
                  role="img"
                  fill="currentColor"
                >
                  <path d="M8.6 7.4L10 6l6 6-6 6-1.4-1.4 4.6-4.6z"></path>
                </svg>
              </Link>
            </div>
            <AnimeCarouselGenre animes={animes} />
          </div>
        ))}
      </div>
    </div>
  );
}
