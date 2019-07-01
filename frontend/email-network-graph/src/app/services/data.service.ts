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
   */
  
  // Constructor
  
  constructor(private apiService : ApiService) {

    // This will only run once as class 'DataService'
    // can only have one instance
    
    this.fetchPeople();
    this.fetchInteractions();
    
  }

  // Public Class Fields
  
  public startDate : Date = new Date('2001-05-06');
  public endDate : Date = new Date('2001-05-09');
  public senderID : number;
  public recepientID : number;

  // (Observable) Public Class Fields
  private people 
  : BehaviorSubject< PersonMap >
    = new BehaviorSubject< PersonMap >(
        new PersonMap()
      );
  
  private interactions 
  : BehaviorSubject< Array<Interaction> >
    = new BehaviorSubject< Array<Interaction> >([]);

  // Public Accessors

  public getInteractions()
  : BehaviorSubject< Array<Interaction> >{
    return this.interactions;
  }

  public getPeople()
  : BehaviorSubject< PersonMap > {
    return this.people;
  }

  // Public Methods (Fetch)

  public fetchInteractions(){

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

  public fetchPeople(){

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

}
