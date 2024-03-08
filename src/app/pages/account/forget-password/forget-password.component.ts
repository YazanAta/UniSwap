import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CustomToastrService } from 'src/app/services/toastr/custom-toastr.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  constructor(private authService: AuthService, private toastr: CustomToastrService) { }

  email: string = ''; // Property to bind to the input field

  ngOnInit(): void {
  }

  async recoverPassword(email: string): Promise<void> {
    try{
      console.log(email)
      await this.authService.recoverPassword(email);
      this.toastr.show("Check your email to recover your password", "Info", "success")
    }catch(error){
      console.log(error)
      this.toastr.show("Error recovering email", "error", "info")
    }
  }
}
