/**
 * Uzbek month names for consistent date formatting
 */
const UZ_MONTHS = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "Iyun",
  "Iyul",
  "Avgust",
  "Sentabr",
  "Oktabr",
  "Noyabr",
  "Dekabr",
]

/**
 * Format date consistently across server and client
 * Input: ISO string like "2026-02-13T10:30:00" or "2026-02-13"
 * Output: Uzbek formatted string like "13 Fevral 2026"
 */
export function formatDateUzbekConsistent(dateString: string): string {
  try {
    // Extract date parts from ISO string
    const match = dateString.match(/(\d{4})-(\d{2})-(\d{2})/)
    if (!match) return dateString

    const year = match[1]
    const month = parseInt(match[2], 10) - 1 // Convert to 0-indexed
    const day = match[3].replace(/^0/, "") // Remove leading zero

    return `${day} ${UZ_MONTHS[month]} ${year}`
  } catch {
    return dateString
  }
}
