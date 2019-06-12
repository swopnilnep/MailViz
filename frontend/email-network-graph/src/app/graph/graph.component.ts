import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Email } from '../models/email';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  emails: Array<Email>;
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getAll().subscribe(data => {
      this.emails = data;
    })
  }

}
