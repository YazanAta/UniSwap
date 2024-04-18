import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CustomToastrService } from 'src/app/services/toastr/custom-toastr.service';
import { CustomValidationsService } from 'src/app/services/validations/custom-validations.service';
import { SuccessfulRegistrationModalComponent } from 'src/app/shared/components/modal/successful-registration-modal/successful-registration-modal.component';

/**
 * Component responsible for user registration.
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  /** The registration form instance. */
  registrationForm: FormGroup;

  /**
   * Creates an instance of RegisterComponent.
   * @param formBuilder The FormBuilder service used to create form groups.
   * @param customValidations The custom validations service for form validation.
   * @param authService The authentication service for user registration.
   * @param router The Angular router service for navigation.
   * @param toastr The custom toastr service for displaying messages.
   * @param modalService The NgbModal service for opening modals.
   */
  constructor(
    private formBuilder: FormBuilder,
    private customValidations: CustomValidationsService,
    private authService: AuthService,
    private router: Router,
    private toastr: CustomToastrService,
    private modalService: NgbModal
  ) {
    // Initialize the registration form upon component instantiation
    this.initForm();
  }

  /**
   * Initializes the registration form with form controls and validation rules.
   * Uses custom validation for email domain and password matching.
   */
  private initForm(): void {
    this.registrationForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, this.customValidations.validateEmailDomain, this.customValidations.strongPasswordValidator]],
      password: ['', [Validators.required, Validators.minLength(8), this.customValidations.strongPasswordValidator()]],
      confirmPassword: ['', Validators.required],
      gender: ['', Validators.required]
    }, { validators: this.customValidations.passwordMatchValidator("password", "confirmPassword") });
  }

  /**
   * Attempts to register a new user with the provided registration form data.
   * If successful, navigates to login page and opens a success modal.
   * If registration fails, displays an error message.
   */
  async register(): Promise<void> {
    if (this.registrationForm.invalid) {
      return; // Exit if form is invalid
    }

    const userData: User = this.registrationForm.value;

    try {
      await this.authService.register(userData);
      this.modalService.open(SuccessfulRegistrationModalComponent);
      this.router.navigate(['/pages/login']);
      this.authService.logout();
    } catch (error) {
      this.handleRegistrationError(error);
    }
  }

  private handleRegistrationError(error: any): void {
    let errorMessage = 'Registration failed. Please try again later.';
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'The email address is already in use by another account.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password should be at least 8 characters long.';
    }

    this.toastr.show(errorMessage, 'Registration Error', 'error');
  }
}
