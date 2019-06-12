import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  emails;
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getEmails().subscribe((data) => {
      this.emails = data; 
    })
  }

}
