import { Component, OnInit ,AfterViewInit,OnDestroy,ViewChild,ElementRef} from '@angular/core';
import { Router} from '@angular/router';
import panzoom from "panzoom";

declare function view_map():any;

@Component({
  selector: 'app-map3-d',
  templateUrl: './map3-d.component.html',
  styleUrls: ['./map3-d.component.css']
})
export class Map3DComponent implements OnInit {
  imu_chart:any;
  blocky:any;
  view_map = view_map;
  @ViewChild('scene', { static: false }) scene:any;

  constructor(
    private router: Router
  ) { 
    this.scene = ElementRef;
  }

 
  refreshPage() {
    this.view_map();
  }

  ngOnInit(): void {
  let page = localStorage.getItem('page');
  if (page === 'map'){
  return;
  }else{
  setTimeout(() => {this.refreshPage();},50)
  }
  localStorage.setItem('page','map');
  }
  ngOnDestroy(){
  localStorage.setItem('page','no')
  }
  }


