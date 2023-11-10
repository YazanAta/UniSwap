import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private auth: AuthService, private formBuilder: FormBuilder) { }

  loginForm = this.formBuilder.group({
    email : ['', Validators.compose([
      Validators.required,
      Validators.email,
    ])],
    password : ['', Validators.compose([
      Validators.required,
    ])],
  })

  ngOnInit(): void {
  }

  login(form){
    this.auth.login(form.value.email, form.value.password).then((result) => {
      console.log(result)
    })
  }

}
