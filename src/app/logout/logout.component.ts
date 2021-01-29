import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
 mainSidebar:any;
  constructor() { }

  ngOnInit(): void {
    localStorage.setItem('login','False');
    this.mainSidebar = document.getElementById("sidebar");
    this.mainSidebar.classList.add("hide");
  }

}
