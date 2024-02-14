import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit{
  constructor(){}//private aus: UsersService, private notification: NotificationsService){}

  usersList: any;
  message: string = '';

  ngOnInit(): void {
   // this.getUsers()
  }
  //getUsers(){
  //  this.aus.getUsers().subscribe((users) => {
  //    this.usersList = users;
  //  })
  //}
//
  //block(uid: string){
  //  this.aus.updateUserBlockedStatus(uid,true)
  //}
//
  //sendMessageToUser(uid, message){
  //  this.aus.sendMessageToUser(uid, message).then(() => {
  //    this.notification.show("Seccess",'Message', "success");
  //  })
  //}
}
