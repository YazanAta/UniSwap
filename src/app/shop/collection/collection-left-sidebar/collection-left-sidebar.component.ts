import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ProductService } from "../../../shared/services/product.service";
import { Product } from '../../../shared/classes/product';
import { Post } from 'src/app/interfaces/post.interface';
import { PostsService } from 'src/app/services/posts/posts.service';
import { CATEGORIES, Category } from 'src/app/interfaces/category.interface';

@Component({
  selector: 'app-collection-left-sidebar',
  templateUrl: './collection-left-sidebar.component.html',
  styleUrls: ['./collection-left-sidebar.component.scss']
})
export class CollectionLeftSidebarComponent implements OnInit {
  
  public grid: string = 'col-xl-3 col-md-6';
  public layoutView: string = 'grid-view';
  public sortBy: string; // Sorting Order
  public mobileSidebar: boolean = false;
  public loader: boolean = true;

  public posts: Post[] = []
  public filteredPosts: Post[] = []

  public collapse1: boolean = true;
  public collapse2: boolean = true;
  public collapse3: boolean = true;


  constructor(private route: ActivatedRoute, private router: Router,
    private viewScroller: ViewportScroller, public productService: ProductService, private postsService: PostsService) {   

      // Get My Query Params
      this.route.queryParams.subscribe(params => {
        if(this.selectedCategory == null){
          this.selectedCategory = this.categories.find(category => category.name == params.category);
        }else{
          this.selectedCategory = this.categories.find(category => category.name == params.category);
          this.filterPostsByCategory();
        }
      });

  }

  ngOnInit(): void {
    this.getAllPosts().then(() => {
      this.filterPostsByCategory();
      console.log(this.filteredPosts);
    });
  }

  getAllPosts() {
    return new Promise((resolve, reject) => {
      this.postsService.getAllPosts().subscribe(posts => {
        this.posts = posts.map(post => {
          return {
            postId: post.payload.doc.id,
            userId : post.payload.doc.ref.parent.parent?.id, // Get the user ID from the document path
            ...post.payload.doc.data() as Post
          }
        });
        
        if(this.filteredPosts.length == 0) {
          this.filteredPosts = this.posts;
        }
        resolve(true);
      }, error => {
        reject(error);
      })
    })
    
  }

  // Categories Section Start
  public categories: Category[] = CATEGORIES;

  selectedCategory = null;
  selectedSubCategory = null;
  selectedSubSubCategory = null;

  // Those Two Functions For Selecting Category Stuff 
  // Those For Loading Of Sub Categories
  selectCategory(category) {
    if (this.selectedSubCategory != null || this.selectedSubSubCategory != null) {
      this.selectedSubCategory = null;
      this.selectedSubSubCategory = null;
    }
    this.selectedCategory = category
    this.filterPostsByCategory();
  }

  selectSubCategory(category) {
    if (this.selectedSubSubCategory != null) {
      this.selectedSubSubCategory = null;
    }
    this.selectedSubCategory = category
    this.filterPostsByCategory();
  }

  selectSubSubCategory(category){
    this.selectedSubSubCategory = category
    this.filterPostsByCategory();
  }

  // Categories Section End

  /*filterPostsByCategory() {
    if (this.selectedSubcategory == null && this.selectedSubSubCategory == null) { 
      this.filteredPosts = this.posts.filter(post => post.category == this.selectedCategory.name);
      console.log(this.selectedCategory?.name, this.selectedSubcategory?.name, this.selectedSubSubCategory?.name);
    }else if (this.selectedSubcategory != null && this.selectedSubSubCategory == null) {
      this.filteredPosts = this.posts.filter(post => post.category == this.selectedCategory.name && post.subCategory == this.selectedSubcategory.name); 
      console.log(this.selectedCategory?.name, this.selectedSubcategory?.name, this.selectedSubSubCategory?.name);
    }else { 
      this.filteredPosts = this.posts.filter(post => post.category == this.selectedCategory.name && post.subCategory == this.selectedSubcategory.name && post.subSubCategory == this.selectedSubSubCategory.name); 
      console.log(this.selectedCategory?.name, this.selectedSubcategory?.name, this.selectedSubSubCategory?.name);
    } 
    console.log(this.filteredPosts);
  }
*/
  filterPostsByCategory() {
    if (this.selectedCategory && this.selectedSubCategory == null && this.selectedSubSubCategory == null) {
      this.filteredPosts = this.posts.filter(post => post.category == this.selectedCategory.name);
      console.log(this.selectedCategory?.name, this.selectedSubCategory?.name, this.selectedSubSubCategory?.name);
    } else if (this.selectedCategory && this.selectedSubCategory && this.selectedSubSubCategory == null) {
      this.filteredPosts = this.posts.filter(post => post.category == this.selectedCategory.name && post.subCategory == this.selectedSubCategory.name); 
      console.log(this.selectedCategory?.name, this.selectedSubCategory?.name, this.selectedSubSubCategory?.name);
    } else if (this.selectedCategory && this.selectedSubCategory && this.selectedSubSubCategory) {
      this.filteredPosts = this.posts.filter(post => post.category == this.selectedCategory.name && post.subCategory == this.selectedSubCategory.name && post.subSubCategory == this.selectedSubSubCategory.name); 
      console.log(this.selectedCategory?.name, this.selectedSubCategory?.name, this.selectedSubSubCategory?.name);
    }
    console.log(this.selectedCategory);
  }


  // Change Grid Layout
  updateGridLayout(value: string) {
    this.grid = value;
  }

  // Change Layout View
  updateLayoutView(value: string) {
    this.layoutView = value;
    if(value == 'list-view')
      this.grid = 'col-lg-12';
    else
      this.grid = 'col-xl-3 col-md-6';
  }

  // Mobile sidebar
  toggleMobileSidebar() {
    this.mobileSidebar = !this.mobileSidebar;
  }

}
