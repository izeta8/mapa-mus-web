export function generateSlug(val: string): string {
  return val
    .toLowerCase()
    .trim()
    .normalize("NFD") // remove accents
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-") // replace spaces with dashes
    .replace(/-+/g, "-"); // collapse multiple dashes
}

export function cleanAddress(rawAddress: string): string {
  return rawAddress.replace(/, España$/i, "").replace(/, Spain$/i, "").trim();
}
