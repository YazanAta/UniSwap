import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { Post } from 'src/app/shared/interfaces/post.interface';
import { PostsService } from 'src/app/services/posts/posts.service';
import { CATEGORIES, Category } from 'src/app/shared/interfaces/category.interface';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-collection-left-sidebar',
  templateUrl: './collection-left-sidebar.component.html',
  styleUrls: ['./collection-left-sidebar.component.scss']
})
export class CollectionLeftSidebarComponent implements OnInit {
  
  public mobileSidebar: boolean = false;
  public loader: boolean = true;

  public posts: Post[] = []
  public filteredPosts: Post[] = []

  public collapse1: boolean = true;
  public collapse2: boolean = true;
  public collapse3: boolean = true;

  constructor(private route: ActivatedRoute, private postsService: PostsService, private authService: AuthService) {   

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
  

  async ngOnInit() {

    const user = await this.authService.getUser();

    await this.getAllPosts(user.uid);
      
    this.filterPostsByCategory();
  
  }

  async getAllPosts(uid) {
    try {
      const posts = await this.postsService.getAllPosts(uid);
      this.posts = posts.map((post) => {
        return {
          id: post.payload.doc.id,
          ...post.payload.doc.data() as Post,
        };
      });
  
      if (this.filteredPosts.length == 0) {
        this.filteredPosts = this.posts;
      }
    } catch (error) {
      console.error(error);
    }
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

  filterPostsByCategory() {
    if (this.selectedCategory && this.selectedSubCategory == null && this.selectedSubSubCategory == null) {
      this.filteredPosts = this.posts.filter(post => post.category == this.selectedCategory.name);
      //console.log(this.selectedCategory?.name, this.selectedSubCategory?.name, this.selectedSubSubCategory?.name);
    } else if (this.selectedCategory && this.selectedSubCategory && this.selectedSubSubCategory == null) {
      this.filteredPosts = this.posts.filter(post => post.category == this.selectedCategory.name && post.subCategory == this.selectedSubCategory.name); 
      //console.log(this.selectedCategory?.name, this.selectedSubCategory?.name, this.selectedSubSubCategory?.name);
    } else if (this.selectedCategory && this.selectedSubCategory && this.selectedSubSubCategory) {
      this.filteredPosts = this.posts.filter(post => post.category == this.selectedCategory.name && post.subCategory == this.selectedSubCategory.name && post.subSubCategory == this.selectedSubSubCategory.name); 
      //console.log(this.selectedCategory?.name, this.selectedSubCategory?.name, this.selectedSubSubCategory?.name);
    }
    //console.log(this.selectedCategory);
  }

  // Mobile sidebar
  toggleMobileSidebar() {
    this.mobileSidebar = !this.mobileSidebar;
  }

}
