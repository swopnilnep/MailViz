import { Entry } from '../entry';
import { ENTRIES } from '../fake-data'
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-network-graph',
  templateUrl: './network-graph.component.html',
  styleUrls: ['./network-graph.component.css']
})
export class NetworkGraphComponent implements OnInit {

  entries: Entry[] = ENTRIES;
  selectedEntry : Entry;
  
  constructor() { }

  ngOnInit() {
  }

  onSelect(entry: Entry) {
    this.selectedEntry = entry;
  }

}
