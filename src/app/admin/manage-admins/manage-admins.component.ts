import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin/admin.service';
import { CustomToastrService } from 'src/app/services/toastr/custom-toastr.service';

@Component({
  selector: 'app-manage-admins',
  templateUrl: './manage-admins.component.html',
  styleUrls: ['./manage-admins.component.scss']
})
export class ManageAdminsComponent {

  adminForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private toastr: CustomToastrService
    ) {}

  ngOnInit(): void {
    this.adminForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  registerAdmin(): void {
    if (this.adminForm.valid) {
      const { email, password } = this.adminForm.value;
      this.adminService.registerNewAdmin(email, password)
        .then(
          () => {
            this.toastr.show(`${email} registered successfully, open email to verify your account`, "Success", "info")
            // Handle any additional logic or UI updates
          }
        )
        .catch(
          (error) => {
            this.toastr.show(`${error}`, "Error", "error")
            // Handle error, display error message, etc.
          }
        );
    }
  }
  
}
