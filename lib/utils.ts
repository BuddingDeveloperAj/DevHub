import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";
import qs from "query-string";
import { BADGE_CRITERIA } from "@/constants";

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

interface BadgeParams {
  criteria: {
    type: keyof typeof BADGE_CRITERIA;
    count: number;
  }[];
}

export const assignBadges = (params: BadgeParams) => {
  const badgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  };

  const { criteria } = params;

  criteria.forEach((item) => {
    let { type, count } = item;

    const badgeLevels: any = BADGE_CRITERIA[type];
    // first go for gold
    while (count >= badgeLevels.GOLD) {
      badgeCounts.GOLD++;
      count -= badgeLevels.GOLD;
    }

    // for silver
    while (count >= badgeLevels.SILVER) {
      badgeCounts.SILVER++;
      count -= badgeLevels.SILVER;
    }

    // for bronze
    while (count >= badgeLevels.BRONZE) {
      badgeCounts.BRONZE++;
      count -= badgeLevels.BRONZE;
    }
  });

  return badgeCounts;
};
