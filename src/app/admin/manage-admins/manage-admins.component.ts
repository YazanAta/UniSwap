import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-manage-admins',
  templateUrl: './manage-admins.component.html',
  styleUrls: ['./manage-admins.component.scss']
})
export class ManageAdminsComponent {
  adminForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private adminService: AdminService) {}

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
          (user) => {
            console.log('Admin registered successfully', user);
            // Handle any additional logic or UI updates
          }
        )
        .catch(
          (error) => {
            console.error('Error registering admin', error);
            // Handle error, display error message, etc.
          }
        );
    }
  }
}
