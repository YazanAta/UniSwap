import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit{
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
