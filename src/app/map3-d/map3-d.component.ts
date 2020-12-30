import { Component, OnInit ,AfterViewInit,OnDestroy} from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-map3-d',
  templateUrl: './map3-d.component.html',
  styleUrls: ['./map3-d.component.css']
})
export class Map3DComponent implements OnInit {
  imu_chart:any;
  blocky:any;
 
  constructor(
    private router: Router
  ) { }

  close_blockly(){
  }

   
  refreshPage() {
    window.location.reload();
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


