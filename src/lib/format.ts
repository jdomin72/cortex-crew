import type { IsoDate } from '@/data/types'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const MONTHS_SHORT = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
]

/** '2026-06' → 'June 2026'. A bare '2026' passes through unchanged. */
export function formatMonthYear(date: IsoDate): string {
  const [year, month] = date.split('-')
  if (!month) return year
  const name = MONTHS[Number(month) - 1]
  return name ? `${name} ${year}` : year
}

/** '2026-06' → 'JUN 2026'. For mono meta rows. */
export function formatShort(date: IsoDate): string {
  const [year, month] = date.split('-')
  if (!month) return year
  const name = MONTHS_SHORT[Number(month) - 1]
  return name ? `${name} ${year}` : year
}

/** Newest first. Sorts lexicographically, which is correct for zero-padded ISO. */
export function sortByDateDesc<T extends { date: IsoDate }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.date.localeCompare(a.date))
}
