import axios from "axios";
import dayjs from "dayjs";

import { type ArticleData } from "~/database.ts";
import { secrets } from "~/environment.ts";
import { byDate } from "~/util.ts";

export interface GNewsResult {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

function mapper(item: GNewsResult): ArticleData {
  return {
    createdAt: dayjs(item.publishedAt).toDate(),
    title: item.title,
    description: item.description ?? "",
    url: item.url,
    image: item.image ?? "",
    score: 0,
    votes: 0,
  };
}

type Category =
  | "general"
  | "world"
  | "nation"
  | "business"
  | "technology"
  | "entertainment"
  | "sports"
  | "science"
  | "health";

function request(category: Category, from: string, to: string) {
  return axios
    .get("https://gnews.io/api/v4/top-headlines", {
      params: {
        apikey: secrets.GNEWS_KEY,
        lang: "en",
        category,
        max: 10,
        from,
        to,
      },
    })
    .then((r) => r.data.articles ?? []);
}

export async function gnews(day: string, _amount?: number) {
  const from = dayjs(day).startOf("day").toISOString();
  const to = dayjs(day).endOf("day").toISOString();

  const techResult = await request("technology", from, to);
  const scienceResult = await request("science", from, to);

  return [...techResult, ...scienceResult].map(mapper).sort(byDate);
}
