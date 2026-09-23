export type Lang = "fa" | "en";
export type SearchParams = Record<string, string | string[] | undefined>;

export function getLang(searchParams: SearchParams): Lang {
  const value = searchParams.lang;
  return (Array.isArray(value) ? value[0] : value) === "fa" ? "fa" : "en";
}
