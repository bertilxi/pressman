import axios from "axios";
import dayjs from "dayjs";

import { type ArticleData } from "~/database.ts";

interface HackernewsResult {
  created_at: string;
  title: string;
  url: string;
  author: string;
  points: number;
  num_comments: number;
}

function mapper(item: HackernewsResult): ArticleData {
  return {
    createdAt: dayjs(item.created_at).toDate(),
    title: item.title,
    url: item.url,
    score: item.points + item.num_comments * 0.5,
    votes: 0,
  };
}

export async function hackernews(day: string, amount = 10) {
  const from = dayjs(day).startOf("day").unix();
  const to = dayjs(day).endOf("day").unix();

  const result = await axios
    .get<{ hits: HackernewsResult[] }>("http://hn.algolia.com/api/v1/search", {
      params: {
        hitsPerPage: amount,
        numericFilters: `created_at_i>${from},created_at_i<${to}`,
      },
    })
    .then((r) => r.data.hits ?? []);

  return result.filter((item) => !!item.url).map(mapper);
}
