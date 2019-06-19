import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Interaction } from '../models/interaction';
import { Person } from '../models/person';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  // API Configuration
  private API_URL = 'http://localhost:51750/api';
  private API_VERSION = 'v1';
  private API_INTERACTIONS_CONTROLLER = 'Time';
  private API_PEOPLE_CONTROLLER = 'People';
  
  // Parameters
  startDate = '2001-05-06';
  endDate = '2001-05-09';

  constructor(private httpClient: HttpClient) { }

  // Get all interactiona
  getInteractions(): Observable<Array<Interaction>> {
    let q = `${this.API_URL}/${this.API_VERSION}/` +
      `${this.API_INTERACTIONS_CONTROLLER}`

    if (this.startDate && this.endDate){
      q += '?';
      q += `start=${this.startDate}&end=${this.endDate}`;
    }

    return this.httpClient.get<Array<Interaction>>
    (q);
  }

  // Get all persons
  getPeople(): Observable<string> {
    return this.httpClient.get<string>
    (`${this.API_URL}/${this.API_VERSION}/${this.API_PEOPLE_CONTROLLER}/`);
  }

  // Put and Delete methods are not implemented
}