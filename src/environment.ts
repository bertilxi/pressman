import "dotenv/config";

function value(key: string, defaulValue = "") {
  return process.env[key] ?? defaulValue;
}

export const secrets = {
  GNEWS_KEY: value("GNEWS_KEY"),
  NEWSAPI_KEY: value("NEWSAPI_KEY"),
  MEDIASTACK_KEY: value("MEDIASTACK_KEY"),
  MONGO_URI: value("MONGO_URI"),
  MONGO_DATABASE: value("MONGO_DATABASE"),
};
