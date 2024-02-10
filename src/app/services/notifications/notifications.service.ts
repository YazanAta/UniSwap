import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
    constructor(private toastr: ToastrService) { }

    show(message: string, title:string, type: string, options?: any) {
        debugger;
        if (!options) {
            options = {
                timeOut: 5000,
                positionClass: 'toast-top-right',
                preventDuplicates: true,
                tapToDismiss: true
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