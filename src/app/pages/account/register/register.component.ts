import { Component, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CustomToastrService } from 'src/app/services/toastr/custom-toastr.service';
import { CustomValidationsService } from 'src/app/services/validations/custom-validations.service';
import { SuccessfulRegistrationModalComponent } from 'src/app/shared/components/modal/successful-registration-modal/successful-registration-modal.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  constructor(
    private formBuilder: FormBuilder,
    private customValidations: CustomValidationsService,
    private auth: AuthService, private router: Router,
    private injector: Injector,
    private toastr: CustomToastrService) { }

  // Form Builder
  registrationForm = this.formBuilder.group({ 

    firstName : ['', Validators.required],

    lastName : ['', Validators.required],

    email : ['', Validators.compose([
      Validators.required,
      Validators.email,
      this.customValidations.validateEmailDomain
    ])],

    password : ['', Validators.compose([
      Validators.required,
      Validators.minLength(8)
    ])],

    confirmPassword : ['', Validators.compose([
      Validators.required,
      Validators.minLength(8)
    ])],

    gender : ['', Validators.required]

  },
  {
    validators: this.customValidations.passwordMatchValidator("password", "confirmPassword")
  });

  // Register method
  async register(form: FormGroup) {

    const data: User = form.value;

    try {

      // Regestration proccess & Sending email verification
      const result = await this.auth.register(data.email, data.password, data);

      // Opening Modal For Successful Registration And Routing For Login
      let modalService = this.injector.get(NgbModal);
      modalService.open(SuccessfulRegistrationModalComponent);
      this.router.navigate(['/pages/login']);

      // Log the user out after sending the verification email
      this.auth.logout();

    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        // Handle the case where the email is already in use By displaying a toastr
        this.toastr.show('The email address is already in use by another account.', 'Failed', 'error');
      } else {
        // Handle other errors By displaying a toastr
        this.toastr.show(error.message, 'Failed', 'error');
      }
    }
  }
  
}
