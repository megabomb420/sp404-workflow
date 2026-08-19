/** Łączy klasy CSS, odsiewając falsy. */
export default function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ')
}
