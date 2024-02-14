import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit{
  constructor(private auth: AuthService, private router: Router){}
  ngOnInit(): void {
    // Toggle collapse on click
    document.querySelectorAll('.nav-link[data-bs-toggle="collapse"]').forEach(function (element) {
      element.addEventListener('click', function () {
          var targetSelector = element.getAttribute('data-bs-target');
          var targetCollapse = document.querySelector(targetSelector);
          var isCollapsed = targetCollapse.classList.contains('show');
          if (isCollapsed) {
              targetCollapse.classList.remove('show');
          } else {
              targetCollapse.classList.add('show');
          }
      });
    });
  }

  logout(){
    this.auth.logout().then(() => {
      this.router.navigate(["/pages/login"])
    })
  }


}
