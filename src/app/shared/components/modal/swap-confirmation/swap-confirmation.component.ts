import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-swap-confirmation',
  templateUrl: './swap-confirmation.component.html',
  styleUrls: ['./swap-confirmation.component.scss']
})
export class SwapConfirmationComponent {
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  constructor(public activeModal: NgbActiveModal) {}

  onConfirm(): void {
    this.confirm.emit();
    this.activeModal.close('confirm');
  }

  onCancel(): void {
    this.cancel.emit();
    this.activeModal.dismiss('cancel');
  }
}
