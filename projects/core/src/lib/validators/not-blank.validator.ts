import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function isBlank(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length === 0;
}

export function notBlankValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    isBlank(control.value) ? { notBlank: true } : null;
}
