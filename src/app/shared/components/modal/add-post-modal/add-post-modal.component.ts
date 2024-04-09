import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CATEGORIES, Category } from 'src/app/shared/interfaces/category.interface';
import { PostsService } from 'src/app/services/posts/posts.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CustomToastrService } from 'src/app/services/toastr/custom-toastr.service';
import { CustomValidationsService } from 'src/app/services/validations/custom-validations.service';
import { CurrencyMaskModule } from 'ng2-currency-mask';

@Component({
  selector: 'app-add-post-modal',
  templateUrl: './add-post-modal.component.html',
  styleUrls: ['./add-post-modal.component.scss'],
  standalone: true,
  imports: [AngularFireStorageModule, ReactiveFormsModule, CommonModule, CurrencyMaskModule]
})
/**
 * Component responsible for displaying a modal to add a new post.
 */
export class AddPostModalComponent implements OnInit {
  /**
   * Form group representing the post form.
   */
  postForm: FormGroup;

  /**
   * Array of available categories.
   */
  categories: Category[] = CATEGORIES;

  /**
   * Array of sub-categories based on the selected category.
   */
  subCategories: Category[] = [];

  /**
   * Array of sub-sub-categories based on the selected sub-category.
   */
  subSubCategories: Category[] = [];

  /**
   * The selected file for the post image.
   */
  selectedFile: File = null;

  /**
   * Flag indicating whether the form is being submitted.
   */
  isSubmitting = false;

  /**
   * The UID of the authenticated user.
   */
  uid: string;

  /**
   * Maximum file size for the post image (2 MB).
   */
  private readonly MAX_FILE_SIZE = 2 * 1024 * 1024;

  /**
   * Allowed MIME types for the post image.
   */
  private readonly ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

  /**
   * Array of pricing options for the post.
   */
  pricings = ['paid', 'free'];

  /**
   * Array of condition options for the post.
   */
  conditions = ['new', 'good condition', 'fair condition', 'damaged'];

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private postsService: PostsService,
    private authService: AuthService,
    private toastr: CustomToastrService
  ) {}

  /**
   * Lifecycle hook called after component initialization.
   */
  async ngOnInit() {
    this.uid = (await this.authService.getUser()).uid;
    this.initializeForm();
    this.setupFormSubscriptions();
  }

  /**
   * Initializes the post form.
   */
  private initializeForm() {
    this.postForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      subCategory: [{ value: '', disabled: true }],
      subSubCategory: [{ value: '', disabled: true }],
      pricing: ['', Validators.required],
      condition: ['', Validators.required],
      image: [null],
      price: [{ value: '', disabled: true }, [Validators.required, CustomValidationsService.priceValidator(1000)]],
    });
  }

  /**
   * Sets up form value change subscriptions.
   */
  private setupFormSubscriptions() {
    this.handlePricingChanges();
    this.handleCategoryChanges();
    this.handleSubCategoryChanges();
  }

  /**
   * Subscribes to changes in the pricing control.
   */
  private handlePricingChanges() {
    this.postForm.get('pricing').valueChanges.subscribe(value => this.togglePriceField(value));
  }

  /**
   * Subscribes to changes in the category control.
   */
  private handleCategoryChanges() {
    this.postForm.get('category').valueChanges.subscribe(value => this.updateSubCategories(value));
  }

  /**
   * Subscribes to changes in the sub-category control.
   */
  private handleSubCategoryChanges() {
    this.postForm.get('subCategory').valueChanges.subscribe(value => this.updateSubSubCategories(value));
  }

  /**
   * Toggles the price field based on the selected pricing option.
   * @param value The selected pricing option ('paid' or 'free').
   */
  private togglePriceField(value: string) {
    value === 'paid' ? this.postForm.get('price').enable() : this.postForm.get('price').disable();
  }

  /**
   * Updates the sub-categories based on the selected category.
   * @param value The selected category value.
   */
  private updateSubCategories(value: string) {
    const category = this.categories.find(c => c.name === value);
    this.subCategories = category ? category.subCategory : [];
    this.resetAndToggleField(this.subCategories.length > 0, 'subCategory');
  }

  /**
   * Updates the sub-sub-categories based on the selected sub-category.
   * @param value The selected sub-category value.
   */
  private updateSubSubCategories(value: string) {
    const category = this.categories.find(c => c.name === this.postForm.get('category').value);
    const subCategory = category?.subCategory.find(sub => sub.name === value);
    this.subSubCategories = subCategory ? subCategory.subCategory : [];
    this.resetAndToggleField(this.subSubCategories.length > 0, 'subSubCategory');
  }

  /**
   * Resets and toggles the enabled state of a form control based on a condition.
   * @param condition The condition to check.
   * @param fieldName The name of the form control.
   */
  private resetAndToggleField(condition: boolean, fieldName: string) {
    const control = this.postForm.get(fieldName);
    control.reset();
    condition ? control.enable() : control.disable();
    control.updateValueAndValidity();
  }

  /**
   * Handles the file selection event.
   * @param event The file selection event.
   */
  onFileSelected(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (!this.ALLOWED_MIME_TYPES.includes(file.type) || file.size > this.MAX_FILE_SIZE) {
      alert('Invalid file type or size. Please select a valid image file.');
      return;
    }
    this.selectedFile = file;
  }

  /**
   * Adds a new post based on the form data.
   */
  addPost() {
    if (this.isSubmitting || !this.postForm.valid) return;
    this.isSubmitting = true;

    const formValue = this.postForm.value;
    if (formValue.price) {
      formValue.price = parseFloat(formValue.price);
    }
    
    this.postsService
      .addPost(this.postForm.value, this.selectedFile, this.uid)
      .then(() => {
        this.toastr.show('Your post has been successfully uploaded and is currently under review by the administrator, You can review your post and it\'s current state from your profile page','Success', 'success', {
          timeOut: 10000,
        })
        this.activeModal.close()
      })
      .catch(error => console.error(error))
      .finally(() => (this.isSubmitting = false));
  }
}
