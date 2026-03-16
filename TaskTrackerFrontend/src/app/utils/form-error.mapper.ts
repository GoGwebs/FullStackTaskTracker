// utils/form-error.mapper.ts
import { FormGroup } from '@angular/forms';
import { ApiValidationError } from '../models/api.error.model';


export function applyApiErrors(
  form: FormGroup,
  apiError: ApiValidationError
): void {
  if (!apiError?.errors) return;

  Object.entries(apiError.errors).forEach(([field, messages]) => {
    // API field names might be lowercase — find the matching control
    const control = findControl(form, field);

    if (control) {
      control.setErrors({
        ...control.errors,      // keep existing client-side errors
        serverError: messages[0], // show the first server message
      });
      control.markAsTouched();  // trigger error display in template
    }
  });
}

// Case-insensitive control lookup — handles 'duedate' → 'dueDate'
function findControl(form: FormGroup, fieldName: string) {
  // Try exact match first
  const exact = form.get(fieldName);
  if (exact) return exact;

  // Fall back to case-insensitive match
  const match = Object.keys(form.controls).find(
    key => key.toLowerCase() === fieldName.toLowerCase()
  );
  return match ? form.get(match) : null;
}