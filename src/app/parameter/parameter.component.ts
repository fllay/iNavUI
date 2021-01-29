import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-parameter',
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.css']
})
export class ParameterComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getEditSpeed();
  }

  getEditSpeed(){
    let url = "http://"+localStorage.getItem("robot_ip")+":5000/editSpeed";
      this.http.get<any>(url).subscribe(res=>{
      console.log(res);
    },err=>{
      console.log('Error: ' + err.error);
      console.log('Name: ' + err.name);
      console.log('Message: ' + err.message);
      console.log('Status: ' + err.status);
    }
    )
   }
}
