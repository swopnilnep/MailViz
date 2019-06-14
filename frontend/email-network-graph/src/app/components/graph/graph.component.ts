import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Interaction } from '../../models/interaction';
import { Person } from '../../models/person';

// Vis Classes
import * as Vis from 'vis';
import { VisEdge } from 'src/app/models/vis';
import { VisNode } from 'src/app/models/vis';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})

export class GraphComponent implements OnInit {

  interactions: Array<Interaction>;
  people: Array<Person>;
  constructor(private dataService: DataService) { }

  ngOnInit() {

    // Retrieve Data From the API with the dataService
    this.dataService.getInteractions().subscribe(data => {
      this.interactions = data;

      // Repeated in both data getter functions
      // Because whichever comes last will
      // Run the 'generateNetworkGraph'
      if (this.people && this.interactions){
        this.generateNetworkGraph();
      }

    })
    
    this.dataService.getPeople().subscribe(data => {
      this.people = data;

      if (this.people && this.interactions){
        this.generateNetworkGraph();
      }

    })
  }

  // Places a Network Graph on the HTML DOM Element
  generateNetworkGraph() {


    console.log("Creating node array..");

    // Create an array of Nodes
    let arrayOfNodes : Array<VisNode> = [];
    this.people.forEach(person =>
        arrayOfNodes.push(new VisNode(person))
    );

    console.log("Creating node dataset..");

    let nodes = new Vis.DataSet(arrayOfNodes);

    console.log("Creating edge array..");

    // Create an array of edges
    let arrayOfEdges : Array<VisEdge> = [];
    this.interactions.forEach(itr =>
        arrayOfEdges.push(new VisEdge(itr))
      );

    console.log("Creating edge dataset..")

    let edges = new Vis.DataSet(arrayOfEdges);

    // Set the vis data
    let data = {
      nodes: nodes,
      edges: edges
    };
  
    let options = {
      groups: {
          failure: {
              color: {
                  background: 'red'
              }
          },
          state: {
              color: {
                  background: 'lime'
              }
          },
          startstate: {
              font: {
                  size: 33,
                  color: 'white'
              },
              color: {
                  background: 'blueviolet'
              }
          },
          finalstate: {
              font: {
                  size: 33,
                  color: 'white'
              },
              color: {
                  background: 'blue'
              }
          }
      },
      edges: {
          arrows: {
              to: {
                  enabled: true
              }
          },
          smooth: {
              enabled: false,
              type: 'continuous'
          }
      },
      physics: {
          adaptiveTimestep: true,
          barnesHut: {
              // gravitationalConstant: -8000,
              springConstant: 0.04,
              springLength: 95
          },
          stabilization: {
              iterations: 987
          }
      },
      layout: {
          randomSeed: 191006,
          improvedLayout: false
      }
  };
  
    console.log("Creating vis Network");

    // Set the vis container
    let container = document.getElementById('network');
    new Vis.Network(container, data, options);

    console.log("Generated Graph")

  }

}
