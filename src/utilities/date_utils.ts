import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";

// Initialize dayjs plugins
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

/**
 * Date format constants
 */
export const DATE_FORMATS = {
    SHORT_DATE: "MM/DD/YYYY",
    LONG_DATE: "MMMM D, YYYY",
    SHORT_DATETIME: "MM/DD/YYYY HH:mm",
    LONG_DATETIME: "MMMM D, YYYY h:mm A",
    TIME: "h:mm A",
    ISO: "YYYY-MM-DD",
};

/**
 * Date utility functions
 */
export const dateUtils = {
    /**
     * Formats a date using the specified format
     * @param date The date to format
     * @param format The format to use (default: SHORT_DATE)
     * @returns Formatted date string or empty string if date is invalid
     */
    format(
        date: Date | string | null | undefined,
        format = DATE_FORMATS.SHORT_DATE,
    ): string {
        if (!date) return "";

        return dayjs(date).format(format);
    },

    /**
     * Formats a date as a relative time (e.g., "2 days ago")
     * @param date The date to format
     * @returns Relative time string or empty string if date is invalid
     */
    fromNow(date: Date | string | null | undefined): string {
        if (!date) return "";

        return dayjs(date).fromNow();
    },

    /**
     * Checks if a date is in the past
     * @param date The date to check
     * @returns True if the date is in the past, false otherwise
     */
    isPast(date: Date | string | null | undefined): boolean {
        if (!date) return false;

        return dayjs(date).isBefore(dayjs());
    },

    /**
     * Checks if a date is in the future
     * @param date The date to check
     * @returns True if the date is in the future, false otherwise
     */
    isFuture(date: Date | string | null | undefined): boolean {
        if (!date) return false;

        return dayjs(date).isAfter(dayjs());
    },

    /**
     * Gets the current date in ISO format (YYYY-MM-DD)
     * @returns Current date in ISO format
     */
    currentDateISO(): string {
        return dayjs().format(DATE_FORMATS.ISO);
    },

    /**
     * Calculates age from birthdate
     * @param birthDate The birth date
     * @returns Age in years, or null if birthDate is invalid
     */
    calculateAge(birthDate: Date | string | null | undefined): number | null {
        if (!birthDate) return null;

        const today = dayjs();
        const birth = dayjs(birthDate);

        if (!birth.isValid()) return null;

        let age = today.year() - birth.year();
        const monthDiff = today.month() - birth.month();

        if (monthDiff < 0 || (monthDiff === 0 && today.date() < birth.date())) {
            age--;
        }

        return age;
    },

    /**
     * Converts a string date to a Date object
     * @param dateString The date string to convert
     * @returns Date object, or null if dateString is invalid
     */
    parseDate(dateString: string | null | undefined): Date | null {
        if (!dateString) return null;

        const date = dayjs(dateString);
        return date.isValid() ? date.toDate() : null;
    },

    /**
     * Converts a Date object to an ISO string date (YYYY-MM-DD)
     * @param date The date to convert
     * @returns ISO date string, or null if date is invalid
     */
    toISODateString(date: Date | string | null | undefined): string | null {
        if (!date) return null;

        const parsedDate = dayjs(date);
        return parsedDate.isValid()
            ? parsedDate.format(DATE_FORMATS.ISO)
            : null;
    },
};
