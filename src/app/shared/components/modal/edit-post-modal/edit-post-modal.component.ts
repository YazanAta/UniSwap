import { Component, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CATEGORIES, Category } from 'src/app/shared/interfaces/category.interface';
import { Post } from 'src/app/shared/interfaces/post.interface';
import { PostsService } from 'src/app/services/posts/posts.service';

@Component({
  selector: 'app-edit-post-modal',
  templateUrl: './edit-post-modal.component.html',
  styleUrls: ['./edit-post-modal.component.scss']
})
export class EditPostModalComponent {
  postForm: FormGroup;
  categories: Category[] = CATEGORIES;
  subCategories: Category[] = [];
  subSubCategories: Category[] = [];
  types = ['Sale', 'Free'];
  isSubmitting = false;
  @Input() post: Post;

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal, private postsService: PostsService, private firestore: AngularFirestore) { }

  ngOnInit(): void {
    console.log(this.post)
    // Create the post form
    // The title, description, category, and type fields are required
    // The subcategory, sub-subcategory, and price fields are optional
    // The subcategory and sub-subcategory fields are disabled by default
    // The price field is disabled by default
    // The price field is enabled if the type is Sale
    this.postForm = this.fb.group({
      title: [this.post.title || '', Validators.required],
      description: [this.post.description || '', Validators.required],
      category: [this.post.category || '' , Validators.required],
      subCategory: [{value: this.post.subCategory || '', disabled: true }],
      subSubCategory:[{ value: this.post.subSubCategory || '', disabled: true }],
      type: [this.post.type || '', Validators.required],
      price: [{value: this.post.price || '', disabled: true}, Validators.required]
    });
    // Disable the price field if the type is Free
    // Enable the price field if the type is Sale
    // Subscribe to the type field value changes
    this.postForm.get('type').valueChanges.subscribe(value => {
      if (value === 'Sale') {
        this.postForm.get('price').enable();
      } else {
        this.postForm.get('price').disable();
      }
    });

    // Get the subcategories for the selected category
    // Reset the subcategory and sub-subcategory fields
    // Enable the subcategory field
    // Subscribe to the category field value changes
    this.postForm.get('category').valueChanges.subscribe(value => {
      const category = this.categories.find(category => category.name === value);
      this.subCategories = category ? category.subCategory : [];
      if (this.subCategories.length > 0) {
         // Reset subcategory and sub-subcategory fields
        this.postForm.get('subCategory').reset(this.subCategories[0].name);
        this.postForm.get('subSubCategory').reset();
        
        this.postForm.get('subCategory').enable();
      } else {
        this.postForm.get('subCategory').disable();
      }
      this.postForm.get('subCategory').updateValueAndValidity();
    });
    
    // Get the sub-subcategories for the selected subcategory
    // Reset the sub-subcategory field
    // Enable the sub-subcategory field
    // Subscribe to the subcategory field value changes
    // Update the value and validity of the sub-subcategory field
    // This is necessary because the sub-subcategory field is disabled
    this.postForm.get('subCategory').valueChanges.subscribe(value => {
      const category = this.categories.find(category => category.name === this.postForm.get('category').value);
      const subCategory = category ? category.subCategory.find(sub => sub.name === value) : null;
      this.subSubCategories = subCategory ? subCategory.subCategory : [];
      if (this.subSubCategories?.length > 0) {
        this.postForm.get('subSubCategory').reset(this.subSubCategories[0].name);
        this.postForm.get('subSubCategory').enable();
      } else {
        this.postForm.get('subSubCategory').disable();
      }
      this.postForm.get('subSubCategory').updateValueAndValidity();
    });
  }

  // Get the selected file from the input
  // Set the selectedFile property to the selected file
  // This will be used when the user clicks the add post button
  // to upload the image to Firebase Storage
  // The selectedFile property will be passed to the addPost method
  // in the PostsService
  selectedFile: File = null;
  onFileSelected(event){
    this.selectedFile = event.target.files[0];
  }


  editPost(postId) {
    if (this.isSubmitting) {
      return; // Do nothing if already submitting
    }
    this.isSubmitting = true;

    const onComplete = () => {
      this.isSubmitting = false;
      this.activeModal.close();
    };

    const updatedPostData = this.postForm.value;

    if (this.selectedFile) {
      // If a new file is selected, update the post with the new image
      this.postsService.editPost(postId, updatedPostData, this.selectedFile).subscribe(
        onComplete,
        onComplete // Handle errors
      );
    } else {
      // If no new file is selected, update the post without changing the image
      this.postsService.editPost(postId, updatedPostData, null).subscribe(
        onComplete,
        onComplete // Handle errors
      );
    }
  }
}
