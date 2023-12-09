import { coerce, isoTimestamp, string, transform } from 'valibot';

export const SearchParamsDateSchema = transform(
  coerce(string([isoTimestamp()]), (v) => decodeURIComponent(v as string)),
  (v) => new Date(v),
);

export type WithSearchParams<U = object> = U & {
  searchParams: Record<string, string | string[] | undefined>;
};

export type WithParams<K extends string, U = object> = {
  params: {
    [key in K]: string;
  };
} & U;
