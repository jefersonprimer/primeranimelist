import { and, desc, eq, gte, ilike, isNotNull, isNull, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { ensureDatabase } from "@/lib/db/bootstrap";
import { anime, manga } from "@/lib/db/schema";

type CalendarItemType = "anime" | "manga";

export type CalendarItem = {
  type: CalendarItemType;
  malId: number;
  title: string;
  synopsis: string | null;
  imageUrl: string | null;
  episodesOrChapters: number | null;
  weekday: number;
  members: number | null;
};

export type CalendarDay = {
  date: Date;
  weekday: number;
  label: string;
  dateLabel: string;
  items: CalendarItem[];
};

export type CalendarMediaFilter = "all" | "anime" | "manga";

const WEEKDAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

function getMonday(date: Date) {
  const copy = new Date(date);
  const day = copy.getDay();
  const distanceFromMonday = (day + 6) % 7;
  copy.setHours(0, 0, 0, 0);
  copy.setDate(copy.getDate() - distanceFromMonday);
  return copy;
}

function formatDateLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export async function getWeeklyReleaseCalendar(filter: CalendarMediaFilter = "all") {
  await ensureDatabase();
  const now = new Date();
  const includeAnime = filter === "all" || filter === "anime";
  const includeManga = filter === "all" || filter === "manga";

  const [airingAnime, publishingManga] = await Promise.all([
    includeAnime
      ? db
          .select({
            malId: anime.malId,
            title: anime.title,
            synopsis: anime.synopsis,
            imageUrl: anime.imageUrl,
            episodes: anime.episodes,
            airedFrom: anime.airedFrom,
            members: anime.members,
          })
          .from(anime)
          .where(
            and(
              eq(anime.isAiring, true),
              ilike(anime.status, "currently airing"),
              isNotNull(anime.airedFrom),
              or(isNull(anime.airedTo), gte(anime.airedTo, now)),
            ),
          )
          .orderBy(desc(anime.members))
      : Promise.resolve([]),
    includeManga
      ? db
          .select({
            malId: manga.malId,
            title: manga.title,
            synopsis: manga.synopsis,
            imageUrl: manga.imageUrl,
            chapters: manga.chapters,
            publishedFrom: manga.publishedFrom,
            members: manga.members,
          })
          .from(manga)
          .where(
            and(
              eq(manga.publishing, true),
              ilike(manga.status, "publishing"),
              isNotNull(manga.publishedFrom),
              or(isNull(manga.publishedTo), gte(manga.publishedTo, now)),
            ),
          )
          .orderBy(desc(manga.members))
      : Promise.resolve([]),
  ]);

  const itemsByWeekday = new Map<number, CalendarItem[]>();
  for (let i = 0; i < 7; i += 1) {
    itemsByWeekday.set(i, []);
  }

  for (const item of airingAnime) {
    if (!item.airedFrom) continue;
    const weekday = item.airedFrom.getDay();
    itemsByWeekday.get(weekday)?.push({
      type: "anime",
      malId: item.malId,
      title: item.title,
      synopsis: item.synopsis,
      imageUrl: item.imageUrl,
      episodesOrChapters: item.episodes,
      weekday,
      members: item.members,
    });
  }

  for (const item of publishingManga) {
    if (!item.publishedFrom) continue;
    const weekday = item.publishedFrom.getDay();
    itemsByWeekday.get(weekday)?.push({
      type: "manga",
      malId: item.malId,
      title: item.title,
      synopsis: item.synopsis,
      imageUrl: item.imageUrl,
      episodesOrChapters: item.chapters,
      weekday,
      members: item.members,
    });
  }

  for (const [weekday, items] of itemsByWeekday.entries()) {
    itemsByWeekday.set(
      weekday,
      items.sort((a, b) => (b.members ?? 0) - (a.members ?? 0)),
    );
  }

  const today = new Date();
  const monday = getMonday(today);
  const todayWeekday = today.getDay();

  const orderedWeekdays = [1, 2, 3, 4, 5, 6, 0];
  const days: CalendarDay[] = orderedWeekdays.map((weekday, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);

    return {
      date,
      weekday,
      label: weekday === todayWeekday ? "TODAY" : WEEKDAY_LABELS[weekday],
      dateLabel: formatDateLabel(date),
      items: itemsByWeekday.get(weekday) ?? [],
    };
  });

  return {
    days,
    totals: {
      anime: airingAnime.length,
      manga: publishingManga.length,
    },
  };
}
