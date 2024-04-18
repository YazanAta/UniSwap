import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-points-description-modal',
  templateUrl: './points-description-modal.component.html',
  styleUrls: ['./points-description-modal.component.scss']
})
export class PointsDescriptionModalComponent {
  constructor(public activeModal: NgbActiveModal) { }


  closeModal(): void {
    this.activeModal.dismiss();
  }
}
