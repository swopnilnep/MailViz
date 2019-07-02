import { Component, OnInit } from '@angular/core';
import { PersonMap } from '../../models/person';
import { Interaction } from 'src/app/models/interaction';
import { DataService } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';
import { NetworkSelectionService } from 'src/app/services/network-selection.service';

// Vis Classes

import * as Vis from 'vis';
import { VisEdge, VisNode}  from 'src/app/models/vis';
import { VisNetworkOptions } from '../../configurations/options';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})

export class GraphComponent implements OnInit {

  //
  // Class Fields
  //

  private people : PersonMap;
  private interactions : Array<Interaction>;
  private network: Vis.Network;
  private subscriptions: Subscription;
  private data: any;

  //
  // Constructor
  //

  constructor(
    private dataService: DataService,
    private selectionService: NetworkSelectionService
    ) {}
  
  //
  // Angular Module Methods
  // 

  ngOnInit() {

    this.subscriptions = new Subscription();

    // Subscribe to the data
    this.subscriptions.add(
      this.dataService
        .getPeople()
        .subscribe(value => {
  
          // Value is not empty
          if ( value.size > 0 ){
            this.people = value;
            
            if (this.interactions && this.people){
              this.generateNetworkGraph();
            }
  
          }
        })     
    );

    this.subscriptions.add(
      this.dataService
        .getInteractions()
        .subscribe(value => {
          
          // Value is not empty
          if ( value.length > 0 ){
            this.interactions = value;
            if (this.interactions && this.people){
              this.generateNetworkGraph();
            }
          }
        })
    );

  }

  ngOnDestroy() {

    // Unsubscribe from all the subscriptions
    this.subscriptions.unsubscribe();

  }

  //
  // Private Methods
  //

  private generateNetworkGraph() {

    // Using a 'Set' allows for distinct
    // nodes during graph generation
    let myPeopleIds = new Set<number>();
    let arrayOfEdges : Array<VisEdge> = [];
    
    this.interactions.forEach(itr => {

        let myEdge = new VisEdge(itr);

        myEdge.setTitle(
          '<b>Emails Sent: </b> ' 
          + itr.emailCount 
          + '<br><b>By : </b>' 
          + this.people.get(itr.senderID).emailName
          + '<br><b>To : </b>' 
          + this.people.get(itr.recepientID).emailName
          + '<br><i>(Double click to view)</i>'
        );

        arrayOfEdges.push(myEdge);

        // Make sure that all ids are added
        // by adding sender and recepient IDs
        // and making 'VisNode's out of them

        myPeopleIds.add(itr.senderID);
        myPeopleIds.add(itr.recepientID);
      }
    );

    let edges = new Vis.DataSet(arrayOfEdges);
    let arrayOfNodes : Array<VisNode> = [];
    
    myPeopleIds.forEach(id => {
        arrayOfNodes.push(
          new VisNode(this.people.get(id))
          );
      }
    );

    let nodes = new Vis.DataSet(arrayOfNodes);
    
    this.data = {
      nodes: nodes,
      edges: edges
    };

    // Options is initialized as its own class
    // Any changes to the options can be done 
    // to the object instance or the file 
    // '../../configurations/options.ts' 

    let options : any = new VisNetworkOptions();
    
    // Since 'Vis' is a JavaScript first framework
    // it binds a network graph to a html DOM
    // element, which in this case is a div
    // with the id 'network'
    let container = 
      document.getElementById('network');

    // Generate network Graph
    this.network = new Vis.Network(
      container, this.data, options
      );

    //
    // Vis Network Events
    //

    // Update the loading progress indicator (spinner)
    // Based on Vis Network interactions
    this.network.on(
      'stabilizationProgress', 
      function(params) {
      document
        .getElementById('indicator').innerHTML = 
          Math
          .round(
            
            (params.iterations/params.total)*100
            
            ) + '%';
    });

    // Remove Spinner DOM Element once loaded
    this.network.once(
      'stabilizationIterationsDone', 
      function() {
      document.getElementById('spinner')
        .style
        .display = 'none';
    });

    this.network.on('doubleClick', (params) => {

      // Gets the node or edge at the current
      // pointer location. 'undefined' if no 
      // node or edge at current location resp.

      let nodeAtPoint = 
        this
        .network
        .getNodeAt(params.pointer.DOM);
      
      let edgeAtPoint = 
        this
        .network
        .getEdgeAt(params.pointer.DOM);
      
      // The selectionService is a 'provider'
      // in Angular with 'SenderID' and 'RecipientID'
      // as subjects.

      if ( nodeAtPoint ) {
        
        let senderID = Number( nodeAtPoint );
        
        this.selectionService
          .assignSender( senderID );

        this.selectionService
          .resetRecipient();

      } else if ( edgeAtPoint ) {

        let edge = 
          this
          .data.edges.get(
          edgeAtPoint
        )

        let senderID : number = Number( edge.from );
        let recipientID : number = Number( edge.to );

        this.selectionService
            .assignSender( senderID );

        this.selectionService
            .assignRecipient( recipientID );

      }

    })

  }
}
