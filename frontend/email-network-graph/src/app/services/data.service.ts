import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { PersonMap, Person } from '../models/person';
import { Interaction } from '../models/interaction';
import { BehaviorSubject } from 'rxjs';

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
   * ( see [providers] in 'app/app.module.ts' )
   */
  
  // Constructor
  
  constructor(private apiService : ApiService) {

    // This will only run once as class 'DataService'
    // can only have one instance
    
    this.fetchPeople();
    this.fetchInteractions();
    
  }

  // Private Class Fields
  
  private startDate : Date = new Date('2001-05-06');
  private endDate : Date = new Date('2001-05-09');
  private senderID : number; // Currently Selected
  private recipientID : number; // Currently Selected

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
  : BehaviorSubject< Object >
    = new BehaviorSubject< Object >({});

  // Public Accessors

  public getSenderID() : number {
    return this.senderID;
  }

  public getRecipientID() : number {
    return this.recipientID;
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

  // Public Methods (Fetch)

  private fetchInteractions(): void {

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
          Number( element.recipientID );
        
        myPerson.emailName = 
          this
          .people.value
          .get(myPerson.id).emailName;
        
        myPerson.emailAddress = 
          this
          .people.value
          .get(myPerson.id).emailAddress;

        myPerson.emailsReceived =
          element.emailsReceived;
          
        participants.push( myPerson );

      })
    });

    this.details.next(
      {domains, participants}
    )

  }
}
