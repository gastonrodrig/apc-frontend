import { Component, HostListener, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isSidebarVisible = false;  // Sidebar is hidden by default on mobile
  isMobileView = false;      // To check if the screen is mobile

  constructor(public login: LoginService) {}

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobileView = window.innerWidth <= 768; // Adjust based on your desired mobile breakpoint
    if (!this.isMobileView) {
      this.isSidebarVisible = true; // Sidebar is visible on desktop
    }
  }

  public logout() {
    this.login.logout();
    window.location.reload();
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible; // Toggle sidebar visibility
  }
}
