import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-successful-registration-modal',
  templateUrl: './successful-registration-modal.component.html',
  styleUrls: ['./successful-registration-modal.component.scss']
})
export class SuccessfulRegistrationModalComponent {
  constructor(public activeModal: NgbActiveModal){}
  closeModal() {
    this.activeModal.close();
  }
}
