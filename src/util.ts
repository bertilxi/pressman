import dayjs from "dayjs";

import { type ReportProvider } from "~/types.ts";

import { type ArticleData } from "./database.ts";

export const DATE_FORMAT = "YYYY-MM-DD";

export function handleError({ response }: any) {
  const { message, code } = response?.data?.error ?? {};

  if (message || code) {
    const error = new Error(message);
    error.name = code;

    throw error;
  }

  throw new Error("request failed");
}

export function byScore(a: ArticleData, b: ArticleData) {
  return b.score - a.score;
}

export function byDate(a: ArticleData, b: ArticleData) {
  return dayjs(b.createdAt).diff(a.createdAt);
}

export function dateRange(start: string, end: string) {
  const days: string[] = [];
  const diff = dayjs(end).diff(start, "days") + 1;

  for (let index = 0; index < diff; index++) {
    days.push(dayjs(start).add(index, "day").format(DATE_FORMAT));
  }

  return days;
}

export async function week(
  provider: ReportProvider,
  start: string,
  end: string
) {
  const days = dateRange(start, end);
  const reports: ArticleData[] = [];

  for (const day of days) {
    const result = await provider(day);
    reports.push(...result);
  }

  return reports.sort(byScore);
}

export async function yesterday(providers: ReportProvider[]) {
  const date = dayjs().subtract(1, "day").startOf("day").format(DATE_FORMAT);
  const reports: ArticleData[] = [];

  for (const provider of providers) {
    console.log(
      `loading provider ${providers.indexOf(provider) + 1}/${providers.length}`
    );
    const result = await provider(date);
    reports.push(...result);
  }

  return reports.sort(byScore);
}
