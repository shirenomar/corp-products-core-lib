import { DateTime, DateTimeOptions, LocaleOptions } from 'luxon';
import { DateFormatter, TimeFormatter } from '../enums/date-formatter.enum';

export class DateHandler {
  /**
   * @param date `ISO string`
   * @param format `format string`
   * @param localeOptions `opts to override the configuration options on this DateTime` - default is system's locale
   * @param isConvertedToUTC
   * @description Returns a string representation of this DateTime formatted according to the specified format string.
   */
  static formatDate(
    date: string,
    format: DateFormatter = DateFormatter.FULL_DATE_TIME,
    localeOptions?: LocaleOptions,
    isConvertedToUTC?: boolean,
  ): string {
    if (!date) {
      return '';
    }
    return this.getDateTimeFromISO(date, isConvertedToUTC ? { zone: 'utc' } : {})
      ?.toFormat(format, localeOptions)
      .toLocaleString();
  }

  static getDateTimeFromISO(
    date: string,
    dateTimeOptions: DateTimeOptions = {},
  ): DateTime {
    return DateTime.fromISO(date, dateTimeOptions);
  }

  static getJSDateFromISO(date: string): Date {
    const dateTime = this.getDateTimeFromISO(date, { zone: 'utc' }); // Ensure it's in UTC
    if (!dateTime.isValid) {
      throw new Error('Invalid date format');
    }
    return new Date(
      dateTime.year,
      dateTime.month - 1,
      dateTime.day,
      dateTime.hour,
      dateTime.minute,
      dateTime.second,
      dateTime.millisecond,
    );
  }

  static getUTCDateTime(date: string): string {
    return this.getDateTimeFromISO(date)?.toUTC()?.toISO() as string;
  }

  static getUTCDateTimeFromJsDate(date: Date): string {
    return this.getDateFromJsDate(new Date(date))?.toUTC()?.toISO() as string;
  }

  static getCurrentUTCDateTime(): string {
    return DateTime.utc().toISO();
  }

  static getDateFromJsDate(date: Date): DateTime {
    return DateTime.fromJSDate(date);
  }

  static checkIfTwoDatesEqual(startDate: Date, endDate: Date): boolean {
    return DateTime.fromJSDate(startDate).equals(DateTime.fromJSDate(endDate));
  }

  static getCurrentDateTime() {
    return DateTime;
  }

  static constructDateTime(date: Date, time: Date, isConvertedToUTC?: boolean) {
    const dateYear = this.getPartialDateOrTime(date, DateFormatter.YEAR);
    const dateMonth = this.getPartialDateOrTime(date, DateFormatter.MONTH);
    const dateDay = this.getPartialDateOrTime(date, DateFormatter.DAY);

    const dateHours = this.getPartialDateOrTime(time, TimeFormatter.HOURS24Format, isConvertedToUTC);
    const dateMinutes = this.getPartialDateOrTime(time, TimeFormatter.MINUTES, isConvertedToUTC);
    const dateSeconds = this.getPartialDateOrTime(time, TimeFormatter.SECONDS, isConvertedToUTC);

    return DateTime.utc(+dateYear, +dateMonth, +dateDay, +dateHours, +dateMinutes, +dateSeconds)
      .toUTC()
      .toISO();
  }

  static getPartialDateOrTime(
    date: Date,
    format: TimeFormatter | DateFormatter,
    isConvertedToUTC?: boolean,
  ) {
    return DateTime.fromJSDate(date, isConvertedToUTC ? { zone: 'utc' } : {}).toFormat(format);
  }
}
