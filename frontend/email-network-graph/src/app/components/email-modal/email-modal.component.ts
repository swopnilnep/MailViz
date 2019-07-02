import { Component, OnInit } from '@angular/core';
import { Person, PersonMap } from '../../models/person';
import { CsvService } from '../../services/csv.service';
import { NetworkSelectionService } from '../../services/network-selection.service'
import { DataService } from '../../services/data.service'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-email-modal',
  templateUrl: './email-modal.component.html',
  styleUrls: ['./email-modal.component.css']
})

export class EmailModalComponent implements OnInit {
  
  //
  // Private Class Fields
  //
  
  private title: string;
  private senderID : number;
  private recipientID: number;
  private subscriptions : Subscription;
  
  // Modal Configuration
  
  private closeBtnName : string;  
  
  // Data Pointers
  
  private domains : Array< any >;
  private participants: Array<Person>;
  private people : PersonMap;

  //
  // Constructor
  //
  
  constructor(
    private dataService: DataService,
    private selectionService: NetworkSelectionService,
    private csvService : CsvService
  ){}

  //
  // Angular Methods
  //

  ngOnInit(){

    this.subscriptions = new Subscription();

    this.subscriptions.add(
      this.dataService
        .getPeople()
        .subscribe( value => {
          this.people = value;
        }
        )

    )

    this.subscriptions.add(
      this.selectionService
        .getSender()
        .subscribe( value => {
          this.senderID = value;
        })
    )

    this.subscriptions.add(
      this.selectionService
        .getRecipient()
        .subscribe( value => {
          this.recipientID = value;
        })
    )
  }

  ngOnDestroy(){

    // This will prevent memory leaks
    this.subscriptions.unsubscribe();

  }

  exportToCsv( itemToExport : string ){
    
    let fileName = 
      this.title 
      + ':' 
      + itemToExport
      + '.csv';
    
    let objToExport : Object[];

    if ( itemToExport === 'domains' ){

      objToExport = this.domains;

    } else if ( itemToExport === 'participants') {

      objToExport = this.participants;

    }

    this.csvService.exportToCsv(

      fileName, objToExport

      )
  }

}

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