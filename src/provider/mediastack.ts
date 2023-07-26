import axios from "axios";
import dayjs from "dayjs";

import { type ArticleData } from "~/database.ts";
import { secrets } from "~/environment.ts";
import { DATE_FORMAT, handleError } from "~/util.ts";

export interface MediastackResult {
  author: string;
  title: string;
  description: string;
  url: string;
  source: string;
  image: string;
  category: string;
  language: string;
  country: string;
  published_at: string;
}

function mapper(item: MediastackResult, index: number): ArticleData {
  return {
    createdAt: dayjs(item.published_at).toDate(),
    title: item.title,
    description: item.description ?? "",
    url: item.url,
    image: item.image ?? "",
    score: 3000 - index * 5,
    votes: 0,
  };
}

type Category =
  | "business"
  | "entertainment"
  | "general"
  | "health"
  | "science"
  | "sports"
  | "technology";

function request(category: Category, from: string, to: string) {
  return axios
    .get("http://api.mediastack.com/v1/news", {
      params: {
        access_key: secrets.MEDIASTACK_KEY,
        categories: category,
        countries: "us",
        languages: "en",
        date: `${from},${to}`,
        sort: "popularity",
        limit: 100,
      },
    })

    .then((r) => r.data.data ?? [], handleError);
}

export async function mediastack(day: string, _amount?: number) {
  const from = dayjs(day).startOf("day").format(DATE_FORMAT);
  const to = dayjs(day).endOf("day").format(DATE_FORMAT);

  const techResult = await request("technology", from, to);
  const scienceResult = await request("science", from, to);

  return [...techResult, ...scienceResult].map(mapper);
}
