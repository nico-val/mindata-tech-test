import { AbstractControl, ValidatorFn } from '@angular/forms';

export const NoWhitespaceValidator: ValidatorFn = (
  control: AbstractControl
) => {
  if (!control.value) {
    return null;
  }
  const hasWhitespace =
    control.value.length > 0 && control.value.trim().length === 0;
  return hasWhitespace ? { whitespace: true } : null;
};
