import { ElementRef, inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DateFormatter } from '../enums/date-formatter.enum';
import { DateHandler } from '../handlers/date-handler';

@Pipe({
  name: 'formateDate',
  standalone: true,
  pure: false,
})
export class FormateDatePipe implements PipeTransform {
  translate = inject(TranslateService);
  private hostElement = inject(ElementRef);

  transform(
    date: string,
    formateKey: DateFormatter = DateFormatter.FULL_DATE_TIME,
    isConvertedToUTC = false,
    calendar: 'gregorian' | 'hijri' = 'gregorian',
  ): string {
    const normalized = this.normalizeInput(date);
    const locale =  'en-SA';
    this.setDatesDirection('ltr');
    const formatted = DateHandler.formatDate(normalized, formateKey, { locale }, isConvertedToUTC);
    return formatted;
    // return this.convertDigits(formatted, lang);
  }

  // Normalize a date string to something DateTime.fromISO can parse
  private normalizeInput(date: string): string {
    if (!date) return '';
    // Already ISO-like (contains 'T') → return as-is
    if (date.includes('T')) return date;
    // Pattern: YYYY-MM-DD HH:mm:ss (no timezone)
    const spacePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    if (spacePattern.test(date)) {
      return date.replace(' ', 'T'); // e.g., 2026-02-09T08:52:51
    }
    // Pattern: YYYY-MM-DD (date only)
    const dateOnly = /^\d{4}-\d{2}-\d{2}$/;
    if (dateOnly.test(date)) {
      return `${date}T00:00:00`;
    }
    // Fallback to original string
    return date;
  }

  // convert digits if Arabic
  private convertDigits(value: string, lang: 'ar' | 'en'): string {
    const western = '0123456789';
    const arabic = '٠١٢٣٤٥٦٧٨٩';

    if (lang === 'ar') {
      return value.replace(/[0-9]/g, (d) => arabic[western.indexOf(d)]);
    } else {
      return value.replace(/[٠-٩]/g, (d) => western[arabic.indexOf(d)]);
    }
  }

  private setDatesDirection(direction: 'ltr' | 'rtl'): void {
    this.hostElement.nativeElement.parentElement?.setAttribute('dir', direction);
  }
}
