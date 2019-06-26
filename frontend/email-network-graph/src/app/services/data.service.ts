import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Interaction } from '../models/interaction';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  // API Configuration
  private API_URL = 'http://localhost:51750/api';
  private API_VERSION = 'v1';
  private API_INTERACTIONS_CONTROLLER = 'Interactions';
  private API_PEOPLE_CONTROLLER = 'People';
  private API_DETAILS_CONTROLLER = 'Details';
  
  // Parameters
  public startDate = '0001-05-06';
  public endDate = '9999-05-09';

  constructor(private httpClient: HttpClient) { }

  // Get all interaction6
  getInteractions(): Observable<any> {
    let q = `${this.API_URL}/${this.API_VERSION}/` +
      `${this.API_INTERACTIONS_CONTROLLER}`

    if (this.startDate && this.endDate){
      q += '?';
      q += `startDate=${this.startDate}&endDate=${this.endDate}`;
    }

    return this.httpClient.get<Array<Interaction>>
    (q);
  }

  // Get all persons
  getPeople(): Observable<any> {
    let q = `${this.API_URL}/${this.API_VERSION}/${this.API_PEOPLE_CONTROLLER}`; 
    
    if (this.startDate && this.endDate){
      q += '?';
      q += `startDate=${this.startDate}&endDate=${this.endDate}`;
    }

    // console.log(q);
    return this.httpClient.get<any>(q);
  }

  // Get Details object with
  // internal objects: participants, domain, timeseries
  getDetails( senderID : number ) : Observable<any> {
    let q = `${this.API_URL}/${this.API_VERSION}/${this.API_DETAILS_CONTROLLER}`; 
    
    q += '?';
    q += `senderID=${senderID}`

    if (this.startDate && this.endDate){
      q += `&startDate=${this.startDate}` 
        + `&endDate=${this.endDate}`;
    }

    // console.log(q);
    return this.httpClient.get<any>(q);

  }

}