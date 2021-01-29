import { Component, OnInit ,Inject,AfterViewInit} from '@angular/core';
import { Router} from '@angular/router';
declare function init_blockly():any;
declare function loadMap():any;
declare function  loadBlockly():any;

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {
  blockly= init_blockly;
  load= loadMap;
  loadblockly = loadBlockly;
  constructor(
    private router: Router
  ) {
  
   }

  go_map3d(){
  this.router.navigateByUrl("map3-d");
  }
  
  _loadBlockly(){
    this.loadblockly();
  }

  ngOnInit(): void {
  }
 ngAfterViewInit(){
  //localStorage.setItem('page','job');
  setTimeout(() => {
    this.load();
    this.blockly();
  },200)
 }
}
