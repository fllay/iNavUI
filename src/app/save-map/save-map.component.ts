import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-save-map',
  templateUrl: './save-map.component.html',
  styleUrls: ['./save-map.component.css']
})
export class SaveMapComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    localStorage.setItem('page','save map');
  }

}
