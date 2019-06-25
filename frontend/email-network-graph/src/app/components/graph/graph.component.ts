import { Component, OnInit, IterableDiffers } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Interaction } from '../../models/interaction';
import { PersonMap, Person } from '../../models/person';

// Vis Classes
import * as Vis from 'vis';
import { VisEdge } from 'src/app/models/vis';
import { VisNode } from 'src/app/models/vis';
import { VisNetworkOptions } from './options';

// ngx-Bootstrap Imports
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { EmailModalComponent } from 'src/app/components/email-modal/email-modal.component';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})

export class GraphComponent implements OnInit {

  interactions: Array<Interaction>;
  people : PersonMap;
  network: Vis.Network;
  bsModalRef : BsModalRef;

  constructor(
    private dataService: DataService,
    private modalService : BsModalService
    ) {}

  ngOnInit() {

    // Retrieve Data From the API with the dataService
    this.dataService.getInteractions().subscribe(res => {

      this.interactions = new Array<Interaction>();
      res.forEach(element => {
        this.interactions.push(new Interaction(element));  
      });

      // Repeated in both data getter functions
      // Because whichever comes last will
      // Run the 'generateNetworkGraph'
      if (this.people && this.interactions){
        this.generateNetworkGraph();
      }
    })
    
    this.dataService.getPeople().subscribe(data => {
      // Initialize the PersonMap
      this.people = new PersonMap();

      // Load the data into the newly created
      // PersonMap object 
      Object.keys(data).forEach( key =>
        {
          this.people.set(
          Number.parseInt(key), new Person(data[key])
          )}
      );

      if (this.people && this.interactions){
        this.generateNetworkGraph();
      }
    })
  }

  generateNetworkGraph() {
    
    // Declare a set to make sure that
    // None of the nodes are repeated during
    // node dataset creation
    let myPeopleIds = new Set<number>();

    // Set the network Edges
    let arrayOfEdges : Array<VisEdge> = [];
    this.interactions.forEach(itr => {
        let myEdge = new VisEdge(itr);
        myEdge.setTitle(
          '<b>Emails Sent: </b> ' + itr.emailCount 
          + '<br><b>By : </b>' + this.people.get(itr.senderID).emailName
          + '<br><b>To : </b>' + this.people.get(itr.recepientID).emailName
          + '<br><i>(Double click to view)</i>'
        )

        arrayOfEdges.push(myEdge);

        // Add the People to the set
        // of people Ids to later make
        // 'Person' objects out of them
        myPeopleIds.add(itr.senderID);
        myPeopleIds.add(itr.recepientID);
      }
    );

    let edges = new Vis.DataSet(arrayOfEdges);

    // Set the network Nodes
    let arrayOfNodes : Array<VisNode> = [];
    myPeopleIds.forEach(id => {
        arrayOfNodes.push(
          new VisNode(this.people.get(id))
          );
      }
    );

    let nodes = new Vis.DataSet(arrayOfNodes);
    
    // Set the network data
    let data = {
      nodes: nodes,
      edges: edges
    };

    // Set the network options
    let options = new VisNetworkOptions();

    // Set the network container
    let container = 
      document.getElementById('network');


    // Generate network Graph
    this.network = new Vis.Network(
      container, data, options
      );


    // Netwrok Events


    // Progress Indicator (Spinner)
    this.network.on('stabilizationProgress', function(params) {
      document.getElementById('indicator').innerHTML = 
        Math.round((params.iterations/params.total)*100) + '%';
    });

    // Remove Spinner DOM Element once loaded
    this.network.once('stabilizationIterationsDone', function() {
      document.getElementById('spinner').style.display = 'none';
    });


    // Open Modal on doubleClick
    this.network.on('doubleClick', (params) => {
      // Node: Using arrow function because functions by default
      // cannot access the component class scope
      
      let elementOnClick : number;
      let isNode : boolean;

      let nodeAtPoint = this.network.getNodeAt(params.pointer.DOM);
      let edgeAtPoint = this.network.getEdgeAt(params.pointer.DOM);

      // Show modal only when double clicked on node or edge
      if (nodeAtPoint) {
        elementOnClick = nodeAtPoint;
        isNode = true;
      } else if (edgeAtPoint) {
        elementOnClick = edgeAtPoint;
        isNode = false;
      }

      if ( elementOnClick ) {
        this.popupModal(elementOnClick, isNode);
      }

    });

  }

  popupModal(elementID : number, isNode : boolean) {
    const initialState = {
      companies: [
        'google.com',
        'yelp.com',
        'taobao.com',
        'alibaba.com'
      ],
      title : isNode ? 
        this.people.get(elementID).emailName + '\'s Interactions' : "Interaction",
      people : [
        {
          name: "Test Dummy",
          email: "email@email.com",
          count: "500"
        },
        {
          name: "Phillip Davis",
          email: "jjjj@ahh.com",
          count: "687"
        },
        {
          name: "Monty Python",
          email: "python@monty.com",
          count: "453"
        }
      ]
    }

    this.bsModalRef = this.modalService.show(EmailModalComponent, {initialState});
    this.bsModalRef.content.closeBtnName = 'Close';
  }
}
