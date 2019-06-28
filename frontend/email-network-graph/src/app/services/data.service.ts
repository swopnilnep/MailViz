import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

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
   */


  //
  // Public Class Fields
  //

  private startDate : Date = new Date('2001-05-06');
  private endDate : Date = new Date('2001-05-09');

  //
  // Public Accessors
  //

  public getStartDate( ){
    return this.startDate;
  }

  public getEndDate( ){
    return this.endDate;
  }

  //
  // Public Mutators
  //

  public setStartDate( other : Date ){
    this.startDate = other;
  }

  public setEndDate( other : Date ){
    this.endDate = other;
  }


  //
  // Constructors
  //

  constructor(api : ApiService) { }
}
