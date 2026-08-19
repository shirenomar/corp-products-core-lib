import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arabicAmPm',
  standalone: true,
})
export class ArabicAmPmPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/\sص$/, ' صباحًا').replace(/\sم$/, ' مساءً');
  }
}
