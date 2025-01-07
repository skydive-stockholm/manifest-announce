import "dayjs/locale/sv"
import updateLocale from "dayjs/plugin/updateLocale"
import dayjs from "dayjs"

/**
 * Formats a date to YYYY-MM-DD string
 * @param date The date to format
 * @returns Formatted date string in YYYY-MM-DD format
 */
export function formatDate(date: Date): string {
    const year: number = date.getFullYear()
    const month: string = String(date.getMonth() + 1).padStart(2, "0") // Adding 1 because getMonth() returns zero-based month
    const day: string = String(date.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
}

/**
 * Calculates the difference in minutes between two dates
 * @param dateFrom Starting date
 * @param dateTo Ending date
 * @returns Number of minutes difference, minimum 0
 */
export function getMinutesDiff(dateFrom: Date, dateTo: Date): number {
    const myDiff: number = Math.floor(
      (dateTo.getTime() - dateFrom.getTime() - 10000) / 60000
    )
    return myDiff > 0 ? myDiff : 0
}

// Configure dayjs
dayjs.extend(updateLocale)
dayjs.updateLocale("en", {
    weekStart: 1,
})

export default dayjs
