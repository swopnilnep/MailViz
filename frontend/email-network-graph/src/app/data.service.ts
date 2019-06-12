import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpClient: HttpClient) {

  }
  
  public getEmails() {
    return this.httpClient.get("http://localhost:51750/api/v1/Email");
  }
}