import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit{

  constructor(private adminService: AdminService){}
  usersList: any;
  message: string = '';

  ngOnInit(): void {
    this.getAllUsers()
  }

  getAllUsers(){
    this.adminService.getUsersByRole("user").subscribe((users) => {
      console.log(users)
      this.usersList = users
    })
  }

  disableAccount(uid: string){
    this.adminService.disableAccount(uid)
  }
}
