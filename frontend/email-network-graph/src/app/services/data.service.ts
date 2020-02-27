import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { PersonMap, Person } from '../models/person';
import { Interaction } from '../models/interaction';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NetworkSelectionService } from './network-selection.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  /**
   * Purpose
   *  The DataService is the service for storing
   *  and accessing project data throughout the project.
   *  Any component or service can simply import this 
   *  service to access public data across the project
   *  
   *  The dataservice is also utilized for fetching 
   *  from the API and potentially other DataSources
   *  using the 'ApiService'
   * 
   * Note
   *  Since this service will consist of all the data
   *  in the project, this will only have once instance
   * ( see 'providers' in 'app/app.module.ts' )
   */
  
  // Constructor
  
  constructor(
    private apiService : ApiService,
    private selectionService: NetworkSelectionService
    ) {

    // This will only run once as class 'DataService'
    // can only have one instance
    
    this.fetchPeople();
    this.fetchInteractions();

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
    );
    
  }

  // Private Class Fields
  
  private startDate : Date = new Date('2001-05-06');
  private endDate : Date = new Date('2001-05-09');
  private senderID : number; // Currently Selected
  private recipientID : number; // Currently Selected
  private subscriptions = new Subscription();

  // (Observable) Public Class Fields

  private people 
  : BehaviorSubject< PersonMap >
    = new BehaviorSubject< PersonMap >(
        new PersonMap()
      );
  
  private interactions 
  : BehaviorSubject< Array<Interaction> >
    = new BehaviorSubject< Array<Interaction> >([]);

  private details
  : BehaviorSubject< any >
    = new BehaviorSubject< any >(null);

  private timeSeries
  : BehaviorSubject< any >
    = new BehaviorSubject< any >(null);

  private emailView
  : BehaviorSubject< any >
    = new BehaviorSubject< any >(null);

  // Public Accessors

  public getSenderID() : number {
    return this.senderID;
  }

  public getRecipientID() : number {
    return this.recipientID;
  }

  public getStartDate()  : Date {
    return this.startDate;
  }

  public getEndDate() : Date {
    return this.endDate;
  }

  // Public Accessors (Observable)

  public getInteractions()
  : BehaviorSubject< Array<Interaction> >{
    return this.interactions;
  }

  public getPeople()
  : BehaviorSubject< PersonMap > {
    return this.people;
  }

  public getDetails()
  : BehaviorSubject< Object >{
    this.fetchDetails();
    return this.details;
  }

  public getTimeSeries()
  : BehaviorSubject< any >{
    this.fetchTimeSeries();
    return this.timeSeries;
  }

  public getEmailView()
  : BehaviorSubject< any >{
    this.fetchEmailView();
    return this.emailView;
  }

  // Public Methods (Fetch)

  private fetchEmailView() : void {
    this.apiService.getEmailView(
      this.senderID,
      this.recipientID,
      this.startDate,
      this.endDate
    ).subscribe(response => {
      let tempEmailView = new Array<any>();
      response.forEach(element => {

        let item = {};
        item["id"] = element["fileID"];
        item["from"] = element["from"];
        item["to"] = element["to"];
        item["cc"] = element["cc"];
        item["bcc"] = element["bcc"];
        item["subject"] = String( element["subject"] );
        item["date"] = new Date( element["dateSent"] );
        
        tempEmailView.push(item);

      });

      this.emailView.next( tempEmailView );
    })
  }

  private fetchTimeSeries() : void {

    this.apiService.getTimeSeries(
      this.senderID,
      this.recipientID,
      // this.startDate,
      // this.endDate

    ).subscribe(response => {

      let tempTimeSeriesArray = new Array<any>();
      response.forEach(element => {
        tempTimeSeriesArray
          .push( new Date(element["date"]) );
      });
      
      this.timeSeries.next( tempTimeSeriesArray );
    })


  }

  private fetchInteractions() : void {

    this.apiService.getInteractions(
      this.startDate, 
      this.endDate
      ).subscribe(response => {

        let tempIntrArray = new Array<Interaction>();
        response.forEach(element => {
          tempIntrArray.push(new Interaction(element));
        });
        
        this.interactions.next( tempIntrArray );
      })
  }

  private fetchPeople() : void {

    this.apiService.getPeople(
      this.startDate,
      this.endDate
      ).subscribe(response => {

        let tempPersonMap = new PersonMap();
        Object.keys( response ).forEach( key => 
          {
            tempPersonMap.set(
              Number.parseInt(key), 
              new Person(response[key])
            );

          });

        this.people.next( tempPersonMap );

      });
  }


  private fetchDetails() : void {

    let domains = new Array<any>();
    let participants = new Array<Person>();

    this.apiService.getDetails(
      this.senderID,
      this.recipientID,
      this.startDate,
      this.endDate
    
    ).subscribe( response => {

      response
      .domains
      .forEach(element => {
        domains.push( element );
      });

      response
      .participants
      .forEach(element => {

        // Create a new 'Person' and add
        // it to the Values participants
        
        let myPerson = new Person();
        
        myPerson.id = 
          Number( element['recepientID'] );
        
        myPerson.emailName = 
          this
          .people.value
          .get(myPerson.id).emailName;
        
        myPerson.emailAddress = 
          this
          .people.value
          .get(myPerson.id).emailAddress;

        myPerson.emailsReceived =
          element['emailsReceived'];
          
        participants.push( myPerson );

      })
    });

    this.details.next(
      {
        domains: domains, 
        participants: participants
      }
    )

  }
}
