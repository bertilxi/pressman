import axios from "axios";
import dayjs from "dayjs";

import { type ArticleData } from "~/database.ts";
import { secrets } from "~/environment.ts";
import { byDate } from "~/util.ts";

export interface NewsapiResult {
  source: {
    id: string;
    name: string;
  };
  author: string;
  title: string;
  description?: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
}

function mapper(item: NewsapiResult): ArticleData {
  return {
    createdAt: dayjs(item.publishedAt).toDate(),
    title: item.title,
    description: item.description ?? "",
    url: item.url,
    image: item.urlToImage ?? "",
    score: 0,
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

function request(category: Category) {
  return axios
    .get("https://newsapi.org/v2/top-headlines", {
      params: {
        apikey: secrets.NEWSAPI_KEY,
        country: "us",
        pageSize: 100,
        category,
      },
    })
    .then((r) => r.data.articles ?? []);
}

export async function newsapi(_day: string, _amount?: number) {
  const techResult = await request("technology");
  const scienceResult = await request("science");

  return [...techResult, ...scienceResult].map(mapper).sort(byDate);
}
