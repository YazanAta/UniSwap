import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, Input, AfterViewInit,
  Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from "../../../services/product.service";
import { Product } from "../../../classes/product";

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss']
})
export class CartModalComponent implements OnInit, AfterViewInit, OnDestroy {
  
  @ViewChild("addPost", { static: false }) AddPost: TemplateRef<any>;

  public modalOpen: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  async openModal() {
      this.modalOpen = true;
      this.modalService.open(this.AddPost, { ariaLabelledBy: 'modal-basic-title' })
  }

  ngOnDestroy() {
    if(this.modalOpen){
      this.modalService.dismissAll();
    }
  }

}
