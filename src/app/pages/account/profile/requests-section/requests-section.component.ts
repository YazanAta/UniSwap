import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SwapService } from 'src/app/services/swap/swap.service';
import { Post } from 'src/app/shared/interfaces/post.interface';

@Component({
  selector: 'app-requests-section',
  templateUrl: './requests-section.component.html',
  styleUrls: ['./requests-section.component.scss']
})
export class RequestsSectionComponent implements OnInit{

  constructor(
    private swapService: SwapService,
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal
  ){}
  
  uid: string


  confirmationModalOpen = false; // Track modal visibility state
  @ViewChild("confirmationModalContent") confirmationModalContent: TemplateRef<any>; // Declare the template reference variable
  selectedPostSwap: Post;
  modalRef: NgbModalRef; // Declare a variable to hold the modal reference
  openConfirmationModal(post: Post) {
    this.modalRef = this.modalService.open(this.confirmationModalContent);
    this.selectedPostSwap = post;
    this.confirmationModalOpen = true;
  }

  async ngOnInit() {

    const user = await this.authService.getUser();
    this.uid = user.uid 

    await this.getRequests(user.uid)

  }

  isSwapping = false;

  requestsAsPost: any[]

  async getRequests(uid){
    this.swapService.getRequests(uid).subscribe((requests) => {
      this.requestsAsPost = requests;
    })
  }
  

  accept(post: Post, uid: string) {
    try {
      if (this.isSwapping) {
        return; // Do nothing if already submitting
      }

      this.isSwapping = true;
  
      this.swapService.acceptSwap(post, uid).then(() => {
        setTimeout(() => {
          this.isSwapping = false; // Remove swapping flag
          // Trigger your swapped arrows animation here
          this.modalRef.close()
        }, 2000);
      });
    } catch (error) {
      console.log(error);
      this.isSwapping = false;
    }
    
  }


  async reject(post: Post, uid: string) {
    if (this.isSwapping) {
      return; // Do nothing if already submitting
    }
    this.isSwapping = true

    this.swapService.rejectSwap(post, uid).then((val) => {
      this.isSwapping = false
    })
  }
}
