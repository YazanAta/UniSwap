import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PostsService } from 'src/app/services/posts/posts.service';
import { AddPostModalComponent } from 'src/app/shared/components/modal/add-post-modal/add-post-modal.component';
import { CATEGORIES, Category } from 'src/app/shared/interfaces/category.interface';
import { Post } from 'src/app/shared/interfaces/post.interface';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent {
  public loader: boolean = true; // Loader state to show loading indicator

  public posts: Post[] = [] // All posts retrieved from the server
  public filteredPosts: Post[] = [] // Posts filtered by category

  public collapse1: boolean = true; // Controls collapse state of UI component 1
  public collapse2: boolean = true; // Controls collapse state of UI component 2
  public collapse3: boolean = true; // Controls collapse state of UI component 3
  public collapseType: boolean = true; // Controls collapse state of UI component 3


  // Mobile sidebar visibility toggle
  public mobileSidebar: boolean = false;
  
  // Category related properties
  public categories: Category[] = CATEGORIES;
  public selectedCategory: Category | null = null;
  public selectedSubCategory: Category | null = null;
  public selectedSubSubCategory: Category | null = null;

  public selectedType: 'all' | 'free' | 'paid' = 'all'; // NEW: Selected post type filter

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private authService: AuthService,
    private modalService: NgbModal) {

    // Subscribe to route query parameters to filter posts based on category selection
    this.route.queryParams.subscribe(params => {
      if(this.selectedCategory == null){
        this.selectedCategory = this.categories.find(category => category.name == params.category);
      }else{
        this.selectedCategory = this.categories.find(category => category.name == params.category);
        this.filterPosts();
      }
    });

  }
  
  // Toggles the visibility of the mobile sidebar
  toggleMobileSidebar() {
    this.mobileSidebar = !this.mobileSidebar;
  }

  // Component initialization
  async ngOnInit() {
    const user = await this.authService.getUser(); // Retrieve the current user
    await this.getAllPosts(user.uid); // Fetch all posts for the user
    this.filterPosts(); // Apply initial category filter to posts
  }

  // Retrieves all posts for a given user
  async getAllPosts(uid: string) {
    try {
      const posts = await this.postsService.getAllPosts(uid);
      this.posts = posts;
  
      // Default to showing all posts if no category filter is applied
      if (this.filteredPosts.length == 0) {
        this.filteredPosts = this.posts;
      }
      
    } catch (error) {
      console.error(error); // Log errors to console
    }
  }

  // Category selection methods
  selectCategory(category: Category) {
    this.resetSelections();
    this.selectedCategory = category;
    this.filterPosts(); // Apply filter based on new category selection
  }

  selectSubCategory(subCategory: Category) {
    this.selectedSubCategory = subCategory;
    this.selectedSubSubCategory = null; // Reset sub-sub-category on new sub-category selection
    this.filterPosts(); // Re-apply filter based on new sub-category selection
  }
  
  selectSubSubCategory(subSubCategory: Category) {
    this.selectedSubSubCategory = subSubCategory;
    this.filterPosts(); // Re-apply filter based on new sub-sub-category selection
  }

  // Resets category selections
  private resetSelections() {
    this.selectedSubCategory = null;
    this.selectedSubSubCategory = null;
  }

  // Filters posts based on selected category and sub-categories
  private filterPosts() {
    this.filteredPosts = this.posts.filter(post => {
      let matchesCategory = this.selectedCategory ? post.category === this.selectedCategory.name : true;
      let matchesSubCategory = this.selectedSubCategory ? post.subCategory === this.selectedSubCategory.name : true;
      let matchesSubSubCategory = this.selectedSubSubCategory ? post.subSubCategory === this.selectedSubSubCategory.name : true;
      let matchesType = this.selectedType === 'all' || post.type === this.selectedType; // NEW: Type filter check

      return matchesCategory && matchesSubCategory && matchesSubSubCategory && matchesType;
    });
  }
  
  // NEW: Method to update selected type and re-filter posts
  selectType(type: 'all' | 'free' | 'paid') {
    this.selectedType = type;
    this.filterPosts();
  }

  // Open add post modal
  public openModal() {
    this.modalService.open(AddPostModalComponent);
  }
}
