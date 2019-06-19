import { Component, OnInit, IterableDiffers } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Interaction } from '../../models/interaction';
import { Person } from '../../models/person';

// Vis Classes
import * as Vis from 'vis';
import { VisEdge } from 'src/app/models/vis';
import { VisNode } from 'src/app/models/vis';
import { VisNetworkOptions } from './options';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})

export class GraphComponent implements OnInit {

  interactions: Array<Interaction>;
  people = new Map<number, Person>();
  constructor(private dataService: DataService) { }

  ngOnInit() {

    // Retrieve Data From the API with the dataService
    this.dataService.getInteractions().subscribe(data => {
      this.interactions = data;

      // Repeated in both data getter functions
      // Because whichever comes last will
      // Run the 'generateNetworkGraph'
      // if (this.people && this.interactions){
      //   // this.generateNetworkGraph();
      // }

    })
    
    this.dataService.getPeople().subscribe(data => {
      this.people = data;

      if (this.people && this.interactions){
        
        // this.generateNetworkGraph();
      }

    })
  }

  // // Places a Network Graph on the HTML DOM Element
  // generateNetworkGraph() {
    
  //   // Declare a set to make sure that
  //   // None of the nodes are repeated during
  //   // node dataset creation
  //   let myPeopleIds = new Set();

  //   // Set the network Edges
  //   let arrayOfEdges : Array<VisEdge> = [];
  //   this.interactions.forEach(itr => {
  //       arrayOfEdges.push(new VisEdge(itr));
  //       myPeopleIds.add(itr.senderID);
  //       myPeopleIds.add(itr.recepientID);
  //     }
  //   );
  //   let edges = new Vis.DataSet(arrayOfEdges);

  //   // Set the network Nodes
  //   let arrayOfNodes : Array<VisNode> = [];
  //   myPeopleIds.forEach(id => {
  //       let index = Number(id)-1;
  //       arrayOfNodes.push(
  //         new VisNode(this.people[index])
  //       );
  //     }
  //   );
  //   let nodes = new Vis.DataSet(arrayOfNodes);
    
  //   // Set the network data
  //   let data = {
  //     nodes: nodes,
  //     edges: edges
  //   };

  //   // Set the network options
  //   let options = new VisNetworkOptions();
  //   // let options = {};

  //   // Set the network container
  //   let container = document.getElementById('network');

  //   // Generate network Graph
  //   new Vis.Network(container, data, options);
  // }

}
