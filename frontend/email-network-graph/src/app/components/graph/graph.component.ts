import { Component, OnInit } from '@angular/core';
import { PersonMap } from '../../models/person';
import { Interaction } from 'src/app/models/interaction';
import { DataService } from 'src/app/services/data.service';

// Vis Classes
import * as Vis from 'vis';
import { VisEdge, VisNode}  from 'src/app/models/vis';
import { VisNetworkOptions } from '../../configurations/options';
import { NetworkSelectionService } from 'src/app/services/network-selection.service';

// ngx-Bootstrap Imports
// import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
// import { EmailModalComponent } from 'src/app/components/email-modal/email-modal.component';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})

export class GraphComponent implements OnInit {

  //
  // Class Fields
  //

  // Observable Fields
  people : PersonMap;
  interactions : Array<Interaction>;

  // Vis Fields
  network: Vis.Network;
  
  // detail_domains;
  // detail_participants;
  // bsModalRef : BsModalRef;

  //
  // Constructor
  //

  constructor(
    private dataService: DataService,
    private selection: NetworkSelectionService
    // private modalService : BsModalService
    ) {}

  //
  // Angular Module Methods
  // 

  ngOnInit() {

    // Subscribe to the data
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
      });     

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
      });
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
        )

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
    
    let data = {
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
      container, data, options
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


  //   // Open Modal on doubleClick
  //   this.network.on('doubleClick', (params) => {
  //     // Node: Using arrow function because functions by default
  //     // cannot access the component class scope
      
  //     let elementOnClick : number;
  //     let isNode : boolean;

  //     let nodeAtPoint = this.network.getNodeAt(params.pointer.DOM);
  //     let edgeAtPoint = this.network.getEdgeAt(params.pointer.DOM);

  //     // Show modal only when double clicked on node or edge
  //     if (nodeAtPoint) {
  //       elementOnClick = Number( nodeAtPoint );
  //       isNode = true;
  //     } else if (edgeAtPoint) {
  //       elementOnClick = Number( edgeAtPoint );
  //       isNode = false;
  //     }

  //     if ( elementOnClick ) {
  //       this.popupModal(elementOnClick, isNode);
  //     }

  //   });

  // }

  // getDetails( senderID : number ){

  //   this.detail_domains = [];
  //   this.detail_participants = [];

  //   this.dataService.getDetails(senderID).subscribe( res => {
      
  //     res.domains.forEach(element => {
  //       this.detail_domains.push(element);
  //     });

  //   });

  //   this.dataService.getDetails(senderID).subscribe( res => {
      
  //     res.participants.forEach(element => {

  //       let p = new Person();
  //       p.id = element.recepientID;
  //       p.emailName = this.dataService.people.get(
  //           Number( p.id )
  //         ).emailName;
  //       p.emailAddress = this.dataService.people.get(
  //           Number( p.id )
  //         ).emailAddress;
  //       p.emailsReceived = element.emailsReceived;

  //       this.detail_participants.push(p);
  //     });

  //   });
  // }

  // popupModal(elementID : number, isNode : boolean) {
    
  //   this.getDetails( elementID );
    
  //   const initialState = {
  //     senderID: this.dataService.people.get(
  //       elementID
  //     ).id,
  //     domains: this.detail_domains,
  //     title : isNode ? 
  //       this.dataService.people
  //         .get(elementID)
  //         .emailName 
  //         + '\'s Interactions' 
  //         : "Interaction",
  //     participants : this.detail_participants
  //   }

  //   this.bsModalRef = this.modalService.show(
  //     EmailModalComponent, 
  //     Object.assign({ initialState }, {class: 'modal-lg-custom'})
  //   )

  //   this.bsModalRef.content.closeBtnName = 'Close';
  }
}
