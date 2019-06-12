import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Email } from './models/email';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  public API = 'http://localhost:51750/api/';
  public API_VERSION = 'v1';
  public API_CONTROLLER = 'Email';
  public EMAILS_API = `${this.API}/${this.API_VERSION}/${this.API_CONTROLLER}/`;

  constructor(private httpClient: HttpClient) { }

  // Get all commnunications
  getAll(): Observable<Array<Email>> {
    return this.httpClient.get<Array<Email>>(this.EMAILS_API);
  }

  // Get communications from a single email address
  get(emailId: string) {
    return this.httpClient.get<Array<Email>>(`${this.EMAILS_API}/${emailId}`);
  }

  // Put and Delete methods are not implemented
}