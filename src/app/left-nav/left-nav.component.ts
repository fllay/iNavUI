import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.css']
})
export class LeftNavComponent implements OnInit {
  joy:any;
  joy_check:any;
  public blockly:any;
  constructor(
    private router: Router
  ) { 
  }
  hide_joy(){
    this.joy = document.getElementById("joy-div");
     this.joy.style.display = "none";
    }
  view_joy(){
    this.joy = document.getElementById("joy-div");
    this.joy.style.display = "block";
  }
  show_blockly(){
    this.blockly = document.getElementById("1a");
    this.blockly.style.display="block";
    this.router.navigateByUrl("job");
  }

  joy_toggle(){
    this.joy_check = document.getElementById("joy_check");
    if(this.joy_check.checked){
    return this.view_joy();
    }else{
      this.hide_joy();
    }
  }

  ngOnInit(): void {
  }
  ngAfterViewInit(){
   // this.hide_joy();
  }

}
