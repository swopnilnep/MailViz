import { Component, OnInit, OnDestroy } from '@angular/core';
import { Person, PersonMap } from '../../models/person';
import { CsvService } from '../../services/csv.service';
import { NetworkSelectionService } from '../../services/network-selection.service'
import { DataService } from '../../services/data.service'
import { Subscription } from 'rxjs';
import { TimeFrame } from 'src/app/models/timeframe';
import { BsModalRef } from 'ngx-bootstrap/modal'

@Component({
  selector: 'app-email-modal',
  templateUrl: './email-modal.component.html',
  styleUrls: ['./email-modal.component.css']
})

export class EmailModalComponent implements OnInit, OnDestroy {
  
  /**
   * 
   * Contains methods that pull data from
   * the 'DataService' to populate and generate
   * parts of the popup modal on a doubleClick
   * of a 'Node' or an 'Edge' in the graph
   * 
   */

  //
  // Private Class Fields
  //
  
  private title: string;
  private senderID : number;
  private recipientID: number;
  private subscriptions : Subscription;
  private senderName: string; // read in template (HTML)
  private recipientName: string; // read in template (HTML)
  private people: PersonMap;
  private timeStream : Array<TimeFrame>;
  
  // Modal Configuration
  
  public timeline;
  public timeaggregate;
  
  // Data Pointers
  
  private domains : Array< any >;
  private participants: Array<Person>;
  private emailView: Array< any >; // Used in Template (HTML)

  //
  // Constructor
  //
  
  constructor(
    private dataService: DataService,
    private selectionService: NetworkSelectionService,
    private csvService : CsvService,
    private bsModalRef : BsModalRef // Used in Template (HTML)
  ){ }
  
  //
  // Angular Methods
  //
  
  ngOnInit(){
    
    this.subscriptions = new Subscription();
  
    this.subscriptions.add(
      this
        .selectionService
        .getRecipient()
        .subscribe( value => {
          this.recipientID = value;
        })
    );
  
    this.subscriptions.add(
      this
        .selectionService
        .getSender()
        .subscribe( value => {
          this.senderID = value;
        })
    )
    this.subscriptions.add(
      this.dataService
        .getDetails()
        .subscribe( value => {
          this.participants = value['participants'];
          this.domains = value['domains'];
        })
    )

    this.subscriptions.add(
      this.dataService
        .getPeople()
        .subscribe( value => {
          this.people = value;

          // This will be used for the popup title
          if ( this.senderID){
            this.senderName 
              = this
                  .people
                  .get(this.senderID)
                  .emailName;
          }

          if ( this.recipientID ){
            this.recipientName
              = this
                .people
                .get(this.recipientID)
                .emailName;
          }
        })
    )

    this.subscriptions.add(
      this.dataService
        .getTimeSeries()
        .subscribe( value => {
          this.timeStream = value;
          this.generateTimeGraph();
        })
    )

    this.subscriptions.add(
      this.dataService
        .getEmailView()
        .subscribe( value => {
          this.emailView = value;
          console.log(value);
        })
    )
    
  }

  ngOnDestroy(){

    // This will prevent memory leaks
    this.subscriptions.unsubscribe();

  }

  //
  // Private Methods
  //

  private generateTimeGraph(){
    
    // The following configuration uses Plotly.js
    // to plot a histogram of the timeSeries data with
    // various filters. Use plotly.js reference for 
    // information on how to modify these parameters 
    //
    // https://plot.ly/javascript/
    // https://github.com/plotly/angular-plotly.js/blob/master/README.md

    let trace = {

      x : this.timeStream,
      autobinx: true,
      autobiny : true,
      name: 'date',
      type: 'histogram'

    }

    let data = [trace]

    let layout = {
      paper_bgcolor: 'rgb(240, 240, 240)',
      plot_bgcolor: 'rgb(240, 240, 240)',
      title: '',
      xaxis: {
        autorange: true,
        // range: ['1984-07-01 06:00', '2016-07-30 18:00'],
        title: '',
        type: 'date'
      },
      yaxis: {
        autorange: true,
        // range: [0, 92.6315789474],
        title: 'Emails Sent',
        type: 'linear'
      },
      updatemenus: [{
            x: 0.1,
            y: 1.15,
            xref: 'paper',
            yref: 'paper',
            yanchor: 'top',
            active: 0,
            showactive: true,
            buttons: [{
                args: ['xbins.size', 'M1'],
                label: 'Month',
                method: 'restyle',
            }, {
                args: ['xbins.size', 'M3'],
                label: 'Quarter',
                method: 'restyle',
            }, {
                args: ['xbins.size', 'M6'],
                label: 'Half Year',
                method: 'restyle',
            }, {
                args: ['xbins.size', 'M12'],
                label: 'Year',
                method: 'restyle',
            }]
      }]
    };
    
    this.timeline = {

      data : data,
      layout : layout

    }


  }

  private exportToCsv( itemToExport : string ){
    
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
