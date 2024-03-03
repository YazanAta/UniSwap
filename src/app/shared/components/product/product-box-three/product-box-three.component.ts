import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { QuickViewComponent } from "../../modal/quick-view/quick-view.component";
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { CustomToastrService } from 'src/app/services/toastr/custom-toastr.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { Router } from '@angular/router';
import { Post } from 'src/app/shared/interfaces/post.interface';

@Component({
  selector: 'app-product-box-three',
  templateUrl: './product-box-three.component.html',
  styleUrls: ['./product-box-three.component.scss']
})
export class ProductBoxThreeComponent implements OnInit {

  @Input() loader: boolean = false;
  @Input() post: any;
  @ViewChild("quickView") QuickView: QuickViewComponent;

  currentUserId: string
  constructor(
    private wishlist: WishlistService,
    private toastr: CustomToastrService,
    private authService: AuthService,
    private chatService: ChatService,
    private router: Router) { }

  async ngOnInit() {

    if(this.loader) {
      setTimeout(() => { this.loader = false; }, 2000); // Skeleton Loader
    }

    const user = await this.authService.getUser();

    this.currentUserId = user.uid;
    
  }

  getTimeDifference(timestamp: { seconds: number, nanoseconds: number }): string {
    const currentDate = new Date();
    const postDate = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

    const timeDifference = currentDate.getTime() - postDate.getTime();

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} d`;
    } else if (hours > 0) {
      return `${hours} hrs`;
    } else if (minutes > 0) {
      return `${minutes} min`;
    } else {
      return `${seconds} s`;
    }
  }

  addToWishlist(id: string): void {
    this.wishlist.addToWishlist(id, this.currentUserId)
    .then(
      (value) => {
        this.toastr.show(value,'Wishlist', 'success');
      })
    .catch(
      (err) => {
        this.toastr.show(err, "Wishlist", 'error')
      })
  }

  // in component
  async createChat(post: Post) {
    const chatId = await this.chatService.createChat(post.ownerId, post.title);

    if (chatId == null) {
      this.toastr.show("Chat Already Exists", "Chat", 'info');
    } else {
      this.router.navigate([`/pages/chats/${chatId}`]);
    }
  }
}
