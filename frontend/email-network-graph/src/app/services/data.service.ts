import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Interaction } from '../models/interaction';
import { Person } from '../models/person';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  public API_URL = 'http://localhost:51750/api/';
  public API_VERSION = 'v1';
  public API_INTERACTIONS_CONTROLLER = 'Email';
  public API_PEOPLE_CONTROLLER = 'People';

  constructor(private httpClient: HttpClient) { }

  // Get all interactiona
  getInteractions(): Observable<Array<Interaction>> {
    return this.httpClient.get<Array<Interaction>>
    (`${this.API_URL}/${this.API_VERSION}/${this.API_INTERACTIONS_CONTROLLER}/`);
  }

  // Get all persons
  getPeople(): Observable<Array<Person>> {
    return this.httpClient.get<Array<Person>>
    (`${this.API_URL}/${this.API_VERSION}/${this.API_PEOPLE_CONTROLLER}/`);
  }

  // Put and Delete methods are not implemented
}