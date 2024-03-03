import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Post } from 'src/app/shared/interfaces/post.interface';
import { AdminService } from 'src/app/services/admin/admin.service';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/shared/interfaces/user.interface';
import { take } from 'rxjs';

@Component({
  selector: 'app-manage-post-modal',
  templateUrl: './manage-post-modal.component.html',
  styleUrls: ['./manage-post-modal.component.scss']
})
export class ManagePostModalComponent implements OnInit{

  public modalOpen: boolean = false;
  public closeResult: string;
  @Input() post: Post;
  
  postStateForm: FormGroup;

  @ViewChild("managePosts", { static: false }) ManagePosts: TemplateRef<any>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private adminService: AdminService,
    private notification: NotificationsService,
    private userService: UserService){}
    
    ownerData: User;

  ngOnInit(): void {
    this.postStateForm = this.fb.group({
      state: ['' || this.post.state, Validators.required],
      message: [''], // Added for rejection message
    });

    this.userService.getUserInfoById(this.post.ownerId).pipe(take(1))
    .subscribe((user) => {
      this.ownerData = user;
    });
  }

  openModal() {
    this.modalOpen = true;
    if (isPlatformBrowser(this.platformId)) { // For SSR 
      this.modalService.open(this.ManagePosts, { 
        size: 'xl',
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
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

  updatePostState() {
    const formData = this.postStateForm.value;
    const selectedState = this.postStateForm.get('state').value;

    if(selectedState === 'rejected'){
      this.adminService.updatePostState(this.post.id, {
        state: this.postStateForm.get('state').value,
        type: this.post.type,
        ownerId: this.post.ownerId
      }).then(() => {
        const ownerId = this.post.ownerId; 
        const message = formData.message;

        if(message == ''){
          const defaultRejectionMessage = `Your post "${this.post.title}" Has Been Rejected`;
          this.notification.pushNotification(ownerId, defaultRejectionMessage, "rejection").then((data) => {
            this.modalService.dismissAll();
          });
        }else{
          this.notification.pushNotification(ownerId, message, "rejection").then((data) => {
            this.modalService.dismissAll();
          });
        }

      })
    }else if (selectedState === 'approved'){
      this.adminService.updatePostState(this.post.id,{
        state: this.postStateForm.get('state').value,
        type: this.post.type,
        ownerId: this.post.ownerId
      }).then(() => {
        const ownerId = this.post.ownerId; 
        const message = formData.message;

        if(message == ''){
          const defaultApprovalMessage = `Your post "${this.post.title}" Has Been Approved`;
          this.notification.pushNotification(ownerId, defaultApprovalMessage, "approval").then((data) => {
            this.modalService.dismissAll();
          });
        }else{
          this.notification.pushNotification(ownerId, message, "approval").then((data) => {
            this.modalService.dismissAll();
          });
        }
      })
    }else{
        this.adminService.updatePostState(this.post.id, {
          state: this.postStateForm.get('state').value
        }).then(()=> {
          this.modalService.dismissAll();
        })
      }
  }
  
}
