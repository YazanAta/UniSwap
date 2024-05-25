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
  userMessages: { [userId: string]: string } = {};

  ngOnInit(): void {
    this.getAllUsers()
  }

  async getAllUsers(){
    this.usersList = await this.adminService.getUsersByRole("user")
  }

  sendMessage(recieverId: string) {
    const message = this.userMessages[recieverId];
    if (message) {
      this.notificationService.pushNotification(recieverId, message, "admin");
      this.userMessages[recieverId] = '';
    }
  }

  async toggleBlockedState(userId: string, isBlocked: boolean) {
    try {
      await this.adminService.updateUserBlockedState(userId, isBlocked);
      // Update local usersList to reflect the change
      const user = this.usersList.find((u: any) => u.id === userId);
      if (user) {
        user.blocked = isBlocked;
      }
    } catch (error) {
      console.error('Error updating user blocked state:', error);
    }
  }


}
