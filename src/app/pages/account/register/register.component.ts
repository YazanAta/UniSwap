import { Component, OnInit, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { CustomValidationsService } from 'src/app/services/validations/custom-validations.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private customValidations: CustomValidationsService, private auth: AuthService, private userService: UserService, private injector: Injector) { }

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
    gender : ['', Validators.compose([
      Validators.required
    ])],
  },
  {
    validators: this.customValidations.passwordMatchValidator("password", "confirmPassword")
  });

  ngOnInit(): void {
  }

  errorMessage: string ;
  modalService: NgbModal;


  async register(form: FormGroup){

    const data: User = form.value;

    await this.auth.register(data.email, data.password)
    .then(result => {

      this.errorMessage = ''
      this.modalService = this.injector.get(NgbModal);

      this.userService.addNewUser(result.user.uid, data)
      .then(() => {
        result.user.updateProfile({
          displayName: `${data.firstName} ${data.lastName}`
        })
        result.user.sendEmailVerification().then(() => {
          this.modalService.open("Open Your Email To Verify Your Account");
        });
      })

    })
    .catch(error => {
      this.errorMessage = error.message
    })
  }

}
