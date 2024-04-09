import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomValidationsService {

  constructor() { }

  /**
   * Validates the email domain to ensure it ends with '@ju.edu.jo'.
   * @param control The form control representing the email input.
   * @returns Validation result object or null if valid.
   */
  validateEmailDomain(control: FormControl) {
    const email = control.value;
    if (email.endsWith('@ju.edu.jo')) {
      return null; // Valid email domain
    } else {
      return { invalidDomain: true }; // Invalid email domain
    }
  }

  /**
   * Custom validator function to check if two form controls (password and confirm password) match.
   * @param password The name of the password form control.
   * @param confirmPassword The name of the confirm password form control.
   * @returns Validator function for matching passwords.
   */
  passwordMatchValidator(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors['passwordMismatch']
      ) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        confirmPasswordControl.setErrors(null);
        return null;
      }
    };
  }

  /**
   * Validator function to validate a price input against a maximum value.
   * @param maxValue The maximum allowable price value.
   * @returns Validator function for price validation.
   */
  static priceValidator(maxValue: number) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const pricePattern = /^\d+(\.\d{1,2})?$/; // Ensure the input is a number possibly with two decimal places
      if (!pricePattern.test(control.value)) {
        return { invalidFormat: true }; // Invalid format
      }
      
      const value = parseFloat(control.value);
      if (value > maxValue) {
        return { maxValueExceeded: true }; // Value exceeds the maximum limit
      }
      
      return null; // Valid value
    };
  }
}