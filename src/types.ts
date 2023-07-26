import { type ArticleData } from "~/database.ts";

export interface ReportProvider {
  (day: string, amount?: number): Promise<ArticleData[]>;
}
