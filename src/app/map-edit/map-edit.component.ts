import { Component, OnInit,AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map-edit',
  templateUrl: './map-edit.component.html',
  styleUrls: ['./map-edit.component.css']
})
export class MapEditComponent implements OnInit {
  img_src:any;
  img:any;
  constructor(
    private http: HttpClient
  ) { }
 cancel(){

 }
 save(event:any){

 }

 load_target_map(){
  this.http.post<any>('http://192.168.1.197:5000/getEditMap', "test").subscribe(res=>{
  console.log(res.files);
    })
 }

 get_img_src(){
  this.img = document.getElementById("canvas");
  var jpegUrl = this.img.toDataURL("image/jpeg");
  this.img_src = jpegUrl;
  console.log(this.img_src);
 }
  ngOnInit(): void {
  }

  ngAfterViewInit(){
    setTimeout(() =>{
      this.get_img_src();
    },1000 )
  }

}
