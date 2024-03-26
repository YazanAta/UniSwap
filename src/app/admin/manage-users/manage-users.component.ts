import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin/admin.service';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit{

  constructor(private adminService: AdminService, private notificationService: NotificationsService){}
  usersList: any;
  message: string = '';

  ngOnInit(): void {
    this.getAllUsers()
  }

  async getAllUsers(){
    this.usersList = await this.adminService.getUsersByRole("user")
  }

  sendMessage(recieverId: string, message: string){
    this.notificationService.pushNotification(recieverId, message, "admin")
  }

}
