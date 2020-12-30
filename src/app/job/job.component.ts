import { Component, OnInit ,Inject,AfterViewInit} from '@angular/core';
declare function init_blockly():any;
declare function loadMap():any;
@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {
  blockly= init_blockly;
  load= loadMap;
  constructor(

  ) {
  
   }

   refreshPage() {
    window.location.reload();
  }

  ngOnInit(): void {
  }
 ngAfterViewInit(){
  //localStorage.setItem('page','job');
  setTimeout(() => {
    this.load();
    this.blockly();
  },500)
 }
}
