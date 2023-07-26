import { uniqBy } from "lodash-es";

import { providers } from "~/provider/index.ts";
import { yesterday } from "~/util.ts";

import { ArticleModel, database } from "./database.ts";

async function main() {
  await database.connect();

  const articles = await yesterday(providers);

  const dedupedArticles = uniqBy(articles, (article) =>
    new URL(article.url).toJSON()
  );

  const result = await ArticleModel.insertMany(dedupedArticles);

  console.log(JSON.stringify(result, undefined, 2));
}

main()
  .catch((error) => {
    try {
      console.error(JSON.stringify(error, undefined, 2));
    } catch {
      console.error(error);
    }
  })
  .finally(() => process.exit());
