import { Component } from '@angular/core';
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
  
  registrationForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private customValidations: CustomValidationsService,
    private authService: AuthService,
    private router: Router,
    private toastr: CustomToastrService,
    private modalService: NgbModal
  ) { 
    this.initForm();
  }

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

  async register(): Promise<void> {
    if (this.registrationForm.invalid) return;

    const data: User = this.registrationForm.value;

    try {
      await this.authService.register(data.email, data.password, data);
      this.modalService.open(SuccessfulRegistrationModalComponent);
      this.router.navigate(['/pages/login']);
      this.authService.logout();
    } catch (error) {
      const errorMessage = error.code === 'auth/email-already-in-use' ? 
        'The email address is already in use by another account.' : error.message;
      this.toastr.show(errorMessage, 'Failed', 'error');
    }
  }
}
