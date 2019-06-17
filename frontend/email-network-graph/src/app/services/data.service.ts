import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Interaction } from '../models/interaction';
import { Person } from '../models/person';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  public API_URL = 'http://localhost:51750/api';
  public API_VERSION = 'v1';
  public API_INTERACTIONS_CONTROLLER = 'Time';
  public API_PEOPLE_CONTROLLER = 'People';
  
  // Parameters
  public START_DATE = '2001-05-06';
  public END_DATE = '2001-05-09';

  constructor(private httpClient: HttpClient) { }

  // Get all interactiona
  getInteractions(): Observable<Array<Interaction>> {
    let q = `${this.API_URL}/${this.API_VERSION}/` +
      `${this.API_INTERACTIONS_CONTROLLER}`

    if (this.START_DATE && this.END_DATE){
      q += '?';
      q += `start=${this.START_DATE}&end=${this.END_DATE}`;
    }

    return this.httpClient.get<Array<Interaction>>
    (q);
  }

  // Get all persons
  getPeople(): Observable<Array<Person>> {
    return this.httpClient.get<Array<Person>>
    (`${this.API_URL}/${this.API_VERSION}/${this.API_PEOPLE_CONTROLLER}/`);
  }

  // Put and Delete methods are not implemented
}