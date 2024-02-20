import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, Input, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Post } from 'src/app/shared/interfaces/post.interface';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/shared/interfaces/user.interface';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { CustomToastrService } from 'src/app/services/toastr/custom-toastr.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-quick-view',
  templateUrl: './quick-view.component.html',
  styleUrls: ['./quick-view.component.scss']
})
export class QuickViewComponent implements OnInit, OnDestroy  {

  @Input() product: Post;
  @ViewChild("quickView", { static: false }) QuickView: TemplateRef<any>;

  public closeResult: string;
  public modalOpen: boolean = false;

  ownerInfo: User;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private router: Router, private modalService: NgbModal, private auth: AuthService, private us: UserService, private ws: WishlistService, private toastr: CustomToastrService) { }

  ngOnInit(): void {
    this.us.getUserInfoById(this.product.ownerId).subscribe((userData) => {
      this.ownerInfo = userData;
    })
  }

  openModal() {
    this.modalOpen = true;
    if (isPlatformBrowser(this.platformId)) { // For SSR 
      this.modalService.open(this.QuickView, { 
        size: 'lg',
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
        windowClass: 'Quickview' 
      }).result.then((result) => {
        `Result ${result}`
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  addToWishlist(id: string): void {
    this.ws.addToWishlist(id)
    .then(
      (value) => {
        this.toastr.show(value,'Wishlist',"success");
      })
    .catch(
      (err) => {
        this.toastr.show(err,'Wishlist',"error");
      })
  }

  ngOnDestroy() {
    if(this.modalOpen){
      this.modalService.dismissAll();
    }
  }

}
