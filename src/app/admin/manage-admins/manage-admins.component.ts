import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin/admin.service';
import { CustomToastrService } from 'src/app/services/toastr/custom-toastr.service';

/**
 * Component for managing the registration of new admins.
 */
@Component({
  selector: 'app-manage-admins',
  templateUrl: './manage-admins.component.html',
  styleUrls: ['./manage-admins.component.scss']
})
export class ManageAdminsComponent implements OnInit {

  /** Form group for the admin registration form. */
  adminForm: FormGroup;

  /**
   * Constructs a new ManageAdminsComponent.
   * @param formBuilder The FormBuilder service for creating form controls.
   * @param adminService The AdminService for interacting with admin-related functionality.
   * @param toastr The CustomToastrService for displaying toastr notifications.
   */
  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private toastr: CustomToastrService
  ) {}

  /**
   * Initializes the admin registration form on component initialization.
   */
  ngOnInit(): void {
    this.adminForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  /**
   * Registers a new admin using the provided form data.
   * Displays success or error toastr notifications based on the registration outcome.
   */
  registerAdmin(): void {
    if (this.adminForm.valid) {
      const { email, password } = this.adminForm.value;
      this.adminService.registerNewAdmin(email, password)
        .then(
          () => {
            this.toastr.show(`${email} registered successfully. Open email to verify your account.`, "Success", "info");
            // Additional logic or UI updates can be added here
          }
        )
        .catch(
          (error) => {
            this.toastr.show(`${error}`, "Error", "error");
            // Handle error, display error message, etc.
          }
        );
    }
  }
}