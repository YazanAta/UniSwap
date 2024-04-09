import { Component, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CATEGORIES, Category } from 'src/app/shared/interfaces/category.interface';
import { Post } from 'src/app/shared/interfaces/post.interface';
import { PostsService } from 'src/app/services/posts/posts.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-edit-post-modal',
  templateUrl: './edit-post-modal.component.html',
  styleUrls: ['./edit-post-modal.component.scss']
})
/**
 * Component for editing a post in a modal window.
 */
export class EditPostModalComponent {
  /**
   * Form group representing the post edit form.
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
   * Maximum file size for the post image upload (2 MB).
   */
  private readonly MAX_FILE_SIZE = 2 * 1024 * 1024;

  /**
   * Allowed MIME types for the post image upload.
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

  /**
   * Flag indicating whether the form is currently submitting.
   */
  isSubmitting = false;

  /**
   * Input property representing the post data to edit.
   */
  @Input() post: Post;

  /**
   * The UID of the authenticated user.
   */
  uid: string;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private postsService: PostsService,
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  /**
   * Lifecycle hook called after component initialization.
   * Initializes the post edit form and sets up form value change subscriptions.
   */
  async ngOnInit() {
    const user = await this.authService.getUser();
    this.uid = user.uid;

    this.initializeForm();
    this.setupFormSubscriptions();
  }

  /**
   * Initializes the post edit form with default values and validators.
   */
  private initializeForm() {
    this.postForm = this.fb.group({
      title: [this.post.title || '', Validators.required],
      description: [this.post.description || '', Validators.required],
      category: [this.post.category || '', Validators.required],
      subCategory: [{ value: this.post.subCategory || '', disabled: true }],
      subSubCategory: [{ value: this.post.subSubCategory || '', disabled: true }],
      condition: [this.post.condition || '', Validators.required],
      pricing: [this.post.pricing || '', Validators.required],
      price: [{ value: this.post.price || '', disabled: true }, Validators.required]
    });
  }

  /**
   * Sets up form value change subscriptions for dynamic form interactions.
   */
  private setupFormSubscriptions() {
    this.postForm.get('pricing').valueChanges.subscribe(value => {
      if (value === 'paid') {
        this.postForm.get('price').enable();
      } else {
        this.postForm.get('price').disable();
      }
    });

    this.postForm.get('category').valueChanges.subscribe(value => {
      const category = this.categories.find(c => c.name === value);
      this.subCategories = category ? category.subCategory : [];
      const subCategoryControl = this.postForm.get('subCategory');
      if (this.subCategories.length > 0) {
        subCategoryControl.reset(this.subCategories[0].name);
        subCategoryControl.enable();
      } else {
        subCategoryControl.disable();
      }
      subCategoryControl.updateValueAndValidity();
    });

    this.postForm.get('subCategory').valueChanges.subscribe(value => {
      const category = this.categories.find(c => c.name === this.postForm.get('category').value);
      const subCategory = category?.subCategory.find(sub => sub.name === value);
      this.subSubCategories = subCategory ? subCategory.subCategory : [];
      const subSubCategoryControl = this.postForm.get('subSubCategory');
      if (this.subSubCategories.length > 0) {
        subSubCategoryControl.reset(this.subSubCategories[0].name);
        subSubCategoryControl.enable();
      } else {
        subSubCategoryControl.disable();
      }
      subSubCategoryControl.updateValueAndValidity();
    });
  }

  /**
   * Handles the file selection event to validate and set the selected file.
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
   * Submits the edited post data.
   * @param postId The ID of the post to edit.
   */
  editPost(postId: string) {
    if (this.isSubmitting) {
      return; // Do nothing if already submitting
    }
    this.isSubmitting = true;

    const onComplete = () => {
      this.isSubmitting = false;
      this.activeModal.close();
    };

    const updatedPostData = this.postForm.value;

    if (updatedPostData.price) {
      updatedPostData.price = parseFloat(updatedPostData.price.replace(/[^0-9.]/g, ''));
    }

    if (this.selectedFile) {
      // If a new file is selected, update the post with the new image
      this.postsService.editPost(postId, updatedPostData, this.selectedFile, this.uid).subscribe(
        onComplete,
        onComplete // Handle errors
      );
    } else {
      // If no new file is selected, update the post without changing the image
      this.postsService.editPost(postId, updatedPostData, null, this.uid).subscribe(
        onComplete,
        onComplete // Handle errors
      );
    }
  }
}
