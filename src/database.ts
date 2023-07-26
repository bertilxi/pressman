import { MongoClient } from "mongodb";
import Papr, { schema, types } from "papr";

import { secrets } from "~/environment.ts";

let client: MongoClient;
export const papr = new Papr();

async function connect() {
  client = await MongoClient.connect(secrets.MONGO_URI);

  papr.initialize(client.db(secrets.MONGO_DATABASE));

  await papr.updateSchemas();
}

async function disconnect() {
  await client.close();
}

export const database = { connect, disconnect };

const articleSchema = schema({
  createdAt: types.date({ required: true }),
  title: types.string({ required: true }),
  description: types.string(),
  url: types.string({ required: true }),
  image: types.string(),
  score: types.number({ required: true }),
  votes: types.number({ required: true }),
});

export type Article = (typeof articleSchema)[0];
export type ArticleData = Omit<Article, "_id">;

export const ArticleModel = papr.model("article", articleSchema);
