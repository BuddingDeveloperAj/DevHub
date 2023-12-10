import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";
import qs from "query-string";

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

interface RemoveQueryParams {
  params: string;
  keys: string[];
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(createdAt: Date): string {
  const now = moment();
  const createdMoment = moment(createdAt);

  return createdMoment.from(now);
}

export function formatNumber(value: number): string | number {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + "M";
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + "K";
  } else {
    return value;
  }
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

export const removeKeysFromQuery = ({ params, keys }: RemoveQueryParams) => {
  const currentUrl = qs.parse(params);

  for (const i of keys) {
    delete currentUrl[i];
  }

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};
