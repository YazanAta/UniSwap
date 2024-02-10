import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, Input,
  Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Product } from "../../../classes/product";
import { ProductService } from '../../../../shared/services/product.service';
import { Post } from 'src/app/interfaces/post.interface';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/interfaces/user.interface';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';

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
    private router: Router, private modalService: NgbModal, private us: UserService, private ws: WishlistService, private notification: NotificationsService) { }

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
        this.notification.show(value,'Wishlist',"success");
      })
    .catch(
      (err) => {
        this.notification.show(err,'Wishlist',"error");
      })
  }

  ngOnDestroy() {
    if(this.modalOpen){
      this.modalService.dismissAll();
    }
  }

}
