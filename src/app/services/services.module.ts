import { NgModule, importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from './admin/admin.service';
import { AuthService } from './auth/auth.service';
import { ChatService } from './chat/chat.service';
import { NotificationsService } from './notifications/notifications.service';
import { PostsService } from './posts/posts.service';
import { CustomToastrService } from './toastr/custom-toastr.service';
import { UserService } from './user/user.service';
import { WishlistService } from './wishlist/wishlist.service';
import { CustomValidationsService } from './validations/custom-validations.service';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { SmoothScrollDirective } from './directives/smooth-scroll.directive';


@NgModule({
  declarations: [
    SmoothScrollDirective
  ],
  imports: [
    CommonModule,
    AngularFirestoreModule
  ],
  providers: [
    SmoothScrollDirective,
    AdminService,
    AuthService,
    ChatService,
    NotificationsService,
    PostsService,
    CustomToastrService,
    UserService,
    WishlistService,
    CustomValidationsService,
    importProvidersFrom(
      provideFirestore(() => getFirestore())
    )
  ]
})
export class ServicesModule { }