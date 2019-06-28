import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Person } from '../../models/person';
import { TimeFrame } from '../../models/timeframe';
import { CsvService } from '../../services/csv.service';

// Vis Classes
import * as Vis from 'vis';
import { VisTimelineOptions } from '../../configurations/options'

@Component({
  selector: 'app-email-modal',
  templateUrl: './email-modal.component.html',
  styleUrls: ['./email-modal.component.css']
})
export class EmailModalComponent implements OnInit {

  // Data Parameters
  title: string;
  domains;
  participants: Array<Person>;
  timestream : Array<TimeFrame>;

  // Configuration Parameters
  closeBtnName: string;
  senderID : number;
  recepientID : number;

  getTimestreamData() {

    this.timestream = [];
    this.dataService.getTimeFrames(this.senderID).subscribe( data => {

      data.forEach( elem => {
        let timeFrame = new TimeFrame();
        timeFrame.content = String( elem.subject );
        timeFrame.start = new Date( elem.startDate );
        timeFrame.end = new Date( elem.endDate );
        this.timestream.push( timeFrame );
      });
      
      // This will generate a timeline using the 
      // Vis JavaScript library once the data for
      // the timeline arrives 
      this.generateTimeline();

    });

  }

  generateTimeline() {

    let items;
    let options;
    let timeline;
    let container;

    container = document.getElementById('visualization');
    items = new Vis.DataSet( this.timestream );

    // items = new Vis.DataSet([
    //   {id: 1, content: 'item 1', start: '2013-04-20'},
    //   {id: 2, content: 'item 2', start: '2013-04-14'},
    //   {id: 3, content: 'item 3', start: '2013-04-18'},
    //   {id: 4, content: 'item 4', start: '2013-04-16', end: '2013-04-19'},
    //   {id: 5, content: 'item 5', start: '2013-04-25'},
    //   {id: 6, content: 'item 6', start: '2013-04-27'}
    // ]);
  

    options = new VisTimelineOptions();
    timeline = new Vis.Timeline( container, items, options );

  }

  // generateTimeline() {
    
  //   let container = document.getElementById('visualization');
  //   let dates = [
  //       {x: '2014-06-11', y: 10},
  //       {x: '2014-06-12', y: 25},
  //       {x: '2014-06-13', y: 30},
  //       {x: '2014-06-14', y: 10},
  //       {x: '2014-06-15', y: 15},
  //       {x: '2014-06-16', y: 30}
  //   ];

  //   let dataset = new Vis.DataSet( dates );
  //   let options = {
  //       style:'bar',
  //       barChart: {width:50, align:'center'}, // align: left, center, right
  //       drawPoints: false,
  //       dataAxis: {
  //           icons:true
  //       },
  //       orientation:'top',
  //       start: '2014-06-10',
  //       end: '2014-06-18'
  //   };
  //   let graph2d = new Vis.Graph2d(container, dates, options);
  // }

  getFileInformation() {



  }

  constructor(
    private csvDataService: CsvService,
    private dataService: ApiService
    ) { }

  ngOnInit() {
    this.getTimestreamData();
  }

  exportToCsv( itemToExport : string ){
    
    let fileName = this.title + ':' 
      + itemToExport
      + '.csv';
    let objToExport : Object[];

    if ( itemToExport === "domains" )
      objToExport = this.domains;
    else if ( itemToExport === "participants" )
      objToExport = this.participants;

    this.csvDataService.exportToCsv(
      fileName, objToExport
    )
  }

}
