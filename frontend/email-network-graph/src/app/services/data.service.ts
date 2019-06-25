import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Interaction } from '../models/interaction';
import { PersonMap } from '../models/person';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  // API Configuration
  private API_URL = 'http://localhost:51750/api';
  private API_VERSION = 'v1';
  private API_INTERACTIONS_CONTROLLER = 'Interactions';
  private API_PEOPLE_CONTROLLER = 'People';
  
  // Parameters
  public startDate = '1980-05-06';
  public endDate = '2018-05-09';

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

  // Put and Delete methods are not implemented
}