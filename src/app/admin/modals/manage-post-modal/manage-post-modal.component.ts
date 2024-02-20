import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Post } from 'src/app/shared/interfaces/post.interface';
import { AdminService } from 'src/app/services/admin/admin.service';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';

@Component({
  selector: 'app-manage-post-modal',
  templateUrl: './manage-post-modal.component.html',
  styleUrls: ['./manage-post-modal.component.scss']
})
export class ManagePostModalComponent implements OnInit{

  public modalOpen: boolean = false;
  public closeResult: string;
  @Input() post: Post;

  @ViewChild("managePosts", { static: false }) ManagePosts: TemplateRef<any>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private modalService: NgbModal, private fb: FormBuilder, private adminService: AdminService, private notification: NotificationsService){}
  postStateForm: FormGroup;

  ngOnInit(): void {
    this.postStateForm = this.fb.group({
      state: ['' || this.post.state, Validators.required],
      message: [''], // Added for rejection message
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

  changePostState() {
    const formData = this.postStateForm.value;
    const selectedState = this.postStateForm.get('state').value;

    if(selectedState === 'rejected'){
      this.adminService.changePostState(this.post.id, {state: this.postStateForm.get('state').value}).then(() => {
        const ownerId = this.post.ownerId; 
        const postId = this.post.id; 
        const message = formData.message;

        this.notification.pushNotification(ownerId, message, "rejection").then((data) => {
          this.modalService.dismissAll();
        });

      })
    }else if (selectedState === 'approved'){
      this.adminService.changePostState(this.post.id, {state: this.postStateForm.get('state').value}).then(() => {
        const ownerId = this.post.ownerId; 
        const postId = this.post.id; 
        const message = formData.message;

        this.notification.pushNotification(ownerId, message, "approval").then((data) => {
          this.modalService.dismissAll();
        });

      })
    }else{
        this.adminService.changePostState(this.post.id, {
          state: this.postStateForm.get('state').value
        }).then(()=> {
          this.modalService.dismissAll();
        })
      }
  }
  
}
