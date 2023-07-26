import { type ReportProvider } from "~/types.ts";

import { gnews } from "./gnews.ts";
import { hackernews } from "./hackernews.ts";
import { mediastack } from "./mediastack.ts";
import { newsapi } from "./newsapi.ts";

export const providers: ReportProvider[] = [
  hackernews,
  gnews,
  mediastack,
  newsapi,
];
