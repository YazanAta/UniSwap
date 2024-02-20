import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CustomToastrService {

  constructor(private toastr: ToastrService) { }

  show(message: string, title:string, type: string, options?: any) {
    if (!options) {
        options = {
            timeOut: 5000,
            preventDuplicates: true,
            tapToDismiss: true,
            easing: 'ease-in',
            easeTime: 1000
        };
    }

    switch (type) {
        case 'success':
            this.toastr.success(message, title, options);
            break;
        case 'warning':
            this.toastr.warning(message, title, options);
            break;
        case 'error':
            this.toastr.error(message, title, options);
            break;
        default:
            this.toastr.info(message, title, options);
    }
  }
}
