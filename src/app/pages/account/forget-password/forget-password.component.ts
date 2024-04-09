// Import Angular core components and services
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CustomToastrService } from 'src/app/services/toastr/custom-toastr.service';

/**
 * Component responsible for handling the forget password feature.
 */
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  /**
   * The email address entered by the user.
   */
  email: string = '';

  /**
   * Creates an instance of ForgetPasswordComponent.
   * @param authService The authentication service used to recover passwords.
   * @param toastr The custom toastr service used to display messages.
   */
  constructor(
    private authService: AuthService,
    private toastr: CustomToastrService
  ) { }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit(): void {
  }

  /**
   * Initiates the process to recover a forgotten password.
   * @param email The email address for password recovery.
   */
  async recoverPassword(email: string): Promise<void> {
    try {
      console.log(email); // Log the email for debugging
      await this.authService.recoverPassword(email); // Call authService to recover password
      this.toastr.show("Check your email to recover your password", "Info", "success");
    } catch (error) {
      console.log(error); // Log any error for debugging
      this.toastr.show("Error recovering email", "error", "info");
    }
  }
}
