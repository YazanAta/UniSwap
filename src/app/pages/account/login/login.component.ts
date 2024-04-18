import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';

/**
 * Interface representing the structure of the login form data.
 */
interface LoginForm {
  email: string;
  password: string;
}

/**
 * Component responsible for rendering and handling user login functionality.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  /** The form group for the login form. */
  loginForm: FormGroup;

  /**
   * Creates an instance of LoginComponent.
   * @param authService The authentication service used for user login.
   * @param formBuilder The form builder service used to create form groups.
   */
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.initForm()
  }

  private initForm(): void {
    // Initialize the login form with validators
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  /**
   * Attempts to log in the user using the provided form data.
   * @param form The login form data containing email and password.
   */
  async login(form: LoginForm): Promise<void> {
    try {
      // Call the AuthService to perform user login
      await this.authService.login(form.email, form.password);
      // Handle successful login (could navigate to another page, show success message, etc.)
    } catch (error) {
      // Handle login error (e.g., display error message)
      console.error('Login failed:', error);
    }
  }
}
