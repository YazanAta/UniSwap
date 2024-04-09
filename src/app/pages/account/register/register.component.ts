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
      email: ['', [Validators.required, Validators.email, this.customValidations.validateEmailDomain]],
      password: ['', [Validators.required, Validators.minLength(8)]],
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
    if (this.registrationForm.invalid) return; // If form is invalid, do not proceed with registration

    const data: User = this.registrationForm.value; // Extract form data as User interface

    try {
      // Call AuthService to register the user
      await this.authService.register(data.email, data.password, data);
      
      // Open a success modal upon successful registration
      this.modalService.open(SuccessfulRegistrationModalComponent);

      // Navigate to login page after registration
      this.router.navigate(['/pages/login']);

      // Perform automatic logout after registration (if needed)
      this.authService.logout();
    } catch (error) {
      // Handle registration error (e.g., display specific error message)
      const errorMessage = error.code === 'auth/email-already-in-use' ?
        'The email address is already in use by another account.' : error.message;
      this.toastr.show(errorMessage, 'Failed', 'error');
    }
  }
}
