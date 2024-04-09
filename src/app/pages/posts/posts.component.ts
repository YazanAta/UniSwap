import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PostsService } from 'src/app/services/posts/posts.service';
import { AddPostModalComponent } from 'src/app/shared/components/modal/add-post-modal/add-post-modal.component';
import { CATEGORIES, Category } from 'src/app/shared/interfaces/category.interface';
import { Post } from 'src/app/shared/interfaces/post.interface';

/**
 * Component responsible for displaying posts and filtering them based on category and pricing type.
 */
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent {
  /** Loader state to show/hide loading indicator. */
  public loader: boolean = true;

  /** All posts retrieved from the server. */
  public posts: Post[] = [];

  /** Posts filtered by category and pricing type. */
  public filteredPosts: Post[] = [];

  /** Collapse state for UI component 1. */
  public collapse1: boolean = true;

  /** Collapse state for UI component 2. */
  public collapse2: boolean = true;

  /** Collapse state for UI component 3. */
  public collapse3: boolean = true;

  /** Mobile sidebar visibility toggle. */
  public mobileSidebar: boolean = false;

  /** Available categories for post filtering. */
  public categories: Category[] = CATEGORIES;

  /** Selected category for filtering posts. */
  public selectedCategory: Category | null = null;

  /** Selected sub-category for filtering posts. */
  public selectedSubCategory: Category | null = null;

  /** Selected sub-sub-category for filtering posts. */
  public selectedSubSubCategory: Category | null = null;

  /** Selected pricing type for filtering posts ('all', 'free', or 'paid'). */
  public selectedPricing: 'all' | 'free' | 'paid' = 'all';

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {
    // Subscribe to route query parameters to filter posts based on category selection
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = this.categories.find(category => category.name === params.category) || null;
      this.filterPosts();
    });
  }
  
  /**
   * Toggles the visibility of the mobile sidebar.
   */
  toggleMobileSidebar(): void {
    this.mobileSidebar = !this.mobileSidebar;
  }

  /**
   * Initializes the component by fetching posts and applying initial filters.
   */
  async ngOnInit(): Promise<void> {
    const user = await this.authService.getUser();
    await this.getAllPosts(user.uid);
    this.filterPosts();
  }

  /**
   * Retrieves all posts for the specified user.
   * @param uid The ID of the user whose posts are to be retrieved.
   */
  async getAllPosts(uid: string): Promise<void> {
    try {
      const posts = await this.postsService.getAllPosts(uid);
      this.posts = posts;
      if (this.filteredPosts.length === 0) {
        this.filteredPosts = this.posts;
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Selects a category and filters posts based on the selected category.
   * @param category The category to be selected for filtering posts.
   */
  selectCategory(category: Category): void {
    this.resetSelections();
    this.selectedCategory = category;
    this.filterPosts();
  }

  /**
   * Selects a sub-category and re-applies filtering based on the selected sub-category.
   * @param subCategory The sub-category to be selected for further filtering.
   */
  selectSubCategory(subCategory: Category): void {
    this.selectedSubCategory = subCategory;
    this.selectedSubSubCategory = null;
    this.filterPosts();
  }
  
  /**
   * Selects a sub-sub-category and re-applies filtering based on the selected sub-sub-category.
   * @param subSubCategory The sub-sub-category to be selected for further filtering.
   */
  selectSubSubCategory(subSubCategory: Category): void {
    this.selectedSubSubCategory = subSubCategory;
    this.filterPosts();
  }

  /**
   * Resets category selections (sub-category and sub-sub-category).
   */
  private resetSelections(): void {
    this.selectedSubCategory = null;
    this.selectedSubSubCategory = null;
  }

  /**
   * Filters posts based on selected category, sub-categories, and pricing type.
   */
  private filterPosts(): void {
    this.filteredPosts = this.posts.filter(post => {
      const matchesCategory = !this.selectedCategory || post.category === this.selectedCategory.name;
      const matchesSubCategory = !this.selectedSubCategory || post.subCategory === this.selectedSubCategory.name;
      const matchesSubSubCategory = !this.selectedSubSubCategory || post.subSubCategory === this.selectedSubSubCategory.name;
      const matchesPricing = this.selectedPricing === 'all' || post.pricing === this.selectedPricing;
      return matchesCategory && matchesSubCategory && matchesSubSubCategory && matchesPricing;
    });
  }
  
  /**
   * Updates the selected pricing type and re-filters posts accordingly.
   * @param pricing The selected pricing type ('all', 'free', or 'paid').
   */
  selectPricing(pricing: 'all' | 'free' | 'paid'): void {
    this.selectedPricing = pricing;
    this.filterPosts();
  }

  /**
   * Opens the add post modal dialog.
   */
  openModal(): void {
    this.modalService.open(AddPostModalComponent);
  }
}
