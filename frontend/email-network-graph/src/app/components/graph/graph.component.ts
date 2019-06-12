import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Email } from '../../models/email';
import * as vis from 'vis';
import { generate } from 'rxjs';

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

    this.generateNetworkGraph();

  }

  // Places a Network Graph on the HTML DOM Element
  generateNetworkGraph() {

    // Create an array of nodes
    var nodes = new vis.DataSet([
      {id: 1, label: 'Node 1'},
      {id: 2, label: 'Node 2'},
      {id: 3, label: 'Node 3'},
      {id: 4, label: 'Node 4'},
      {id: 5, label: 'Node 5'}
    ]);
  
    // Create an array with edges
    var edges = new vis.DataSet([
      { from: 1, to: 3},
      { from: 1, to: 2},
      { from: 2, to: 4},
      { from: 2, to: 5},
    ])
  
    // Set the vis data
    var data = {
      nodes: nodes,
      edges: edges
    };
  
    var options = {};
  
    // Set the vis container
    var container = document.getElementById('network');
  
    new vis.Network(container, data, options);

  }

}
