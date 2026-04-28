export type GenreDefinition = {
  label: string;
  description: string;
};

export const GENRE_DEFINITIONS = {
  action: {
    label: "Action",
    description: "Fast-paced anime titles with intense fights, pressure, and momentum.",
  },
  adventure: {
    label: "Adventure",
    description: "Journeys, discoveries, and anime built around exploration.",
  },
  comedy: {
    label: "Comedy",
    description: "Anime titles driven by humor, absurdity, and lighthearted energy.",
  },
  drama: {
    label: "Drama",
    description: "Character-heavy stories built on conflict, stakes, and emotional weight.",
  },
  fantasy: {
    label: "Fantasy",
    description: "Worlds shaped by magic, myth, and larger-than-life imagination.",
  },
  historical: {
    label: "Historical",
    description: "Anime titles inspired by real eras, settings, and cultural history.",
  },
  music: {
    label: "Music",
    description: "Performance-focused anime about bands, idols, composers, and sound.",
  },
  romance: {
    label: "Romance",
    description: "Anime titles centered on relationships, longing, and emotional chemistry.",
  },
  "sci-fi": {
    label: "Sci-Fi",
    description: "Futuristic anime exploring technology, space, and speculative ideas.",
  },
  seinen: {
    label: "Seinen",
    description: "Anime titles with more mature themes, tone, or subject matter.",
  },
  shojo: {
    label: "Shojo",
    description: "Character-first anime with a strong focus on emotion and interpersonal arcs.",
  },
  shonen: {
    label: "Shonen",
    description: "High-energy anime built around growth, rivalry, and big payoffs.",
  },
  "slice-of-life": {
    label: "Slice of Life",
    description: "Everyday anime titles that thrive on atmosphere, routine, and small moments.",
  },
  sports: {
    label: "Sports",
    description: "Competitive anime driven by teamwork, training, and clutch performances.",
  },
  supernatural: {
    label: "Supernatural",
    description: "Anime shaped by spirits, curses, monsters, and unexplained powers.",
  },
  thriller: {
    label: "Thriller",
    description: "Tense anime titles built around suspense, danger, and uncertainty.",
  },
  "post-apocalyptic": {
    label: "Post-Apocalyptic",
    description: "Anime set after collapse, focused on survival, rebuilding, and aftermath.",
  },
} satisfies Record<string, GenreDefinition>;

export type GenreSlug = keyof typeof GENRE_DEFINITIONS;

export function getGenreDefinition(genre: string) {
  return GENRE_DEFINITIONS[genre as GenreSlug] ?? null;
}
