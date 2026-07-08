import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Returns true when value is a string that is empty or contains only whitespace. */
export function isBlank(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length === 0;
}

/** Rejects strings that are empty or whitespace-only. Use alongside Validators.required. */
export function notBlankValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    isBlank(control.value) ? { notBlank: true } : null;
}
