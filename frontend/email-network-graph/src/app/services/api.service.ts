import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Query } from '../models/query';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
/**
 * 
 * Purpose
 *  This class ApiService, is the main accesspoint
 *  to the backend API endpoints. It consists of
 *  details about the APIs and contains GET requests
 *  that can be called upon by another service or 
 *  component
 * 
 */

 //
 // Private API Configuration ( Fields )
 //

  private readonly API_URL : string = 'http://localhost:51750/api';
  private readonly API_VERSION : string  = 'v1';
  private readonly API_INTERACTIONS_CONTROLLER : string = 'Interactions';
  private readonly API_PEOPLE_CONTROLLER : string = 'People';
  private readonly API_DETAILS_CONTROLLER : string = 'Details';
  private readonly API_TIMESTREAM_CONTROLLER : string = 'Timestream';
  private readonly API_TIMESERIES_CONTROLLER : string = 'TimeSeries';
  private readonly API_EMAIL_VIEW_CONTROLLER : string = 'EmailView';
  
  //
  // Public Methods
  //
  
  public getInteractions(

    startDate? : Date,
    endDate? : Date
  
    ): Observable<any> 
  {
    
    let query = new Query(this.API_URL);
    
    query.addPath(this.API_VERSION);
    query.addPath(this.API_INTERACTIONS_CONTROLLER);
    
    if ( startDate )
      query.addParameter(
        'startDate',
        startDate.toISOString()
        );
    
    if ( endDate )
      query.addParameter(
        'endDate',
        endDate.toISOString()
        );

    return this.httpClient.get<any>
    ( query.getString() );
  }
  
  public getPeople(
    startDate? : Date,
    endDate? : Date
  
    ): Observable<any> 
  {
    
    let query = new Query( this.API_URL );

    query.addPath(this.API_VERSION);
    query.addPath(this.API_PEOPLE_CONTROLLER);

    if ( startDate ){
      query.addParameter(
        'startDate',
        startDate.toISOString());
    }

    if ( endDate ){
      query.addParameter(
        'endDate',
        endDate.toISOString());
    }

    return this.httpClient.get<any>
    ( query.getString() );
  }
  
  public getDetails( 

    senderID : number,
    recipientID? : number,
    startDate? : Date,
    endDate? : Date
  
    ) : Observable<any> 
  {

    let query = new Query( this.API_URL);
    query.addPath( this.API_VERSION );
    query.addPath( this.API_DETAILS_CONTROLLER );

    // Required Parameters
    query.addParameter('senderID',senderID);
    
    // Optional Parameters
    if ( recipientID ){
      query.addParameter(
        'recipientID',
        recipientID);
    }
    
    if ( startDate ){
      query.addParameter(
        'startDate',
        startDate.toISOString());
    }

    if ( endDate ) {
      query.addParameter(
        'endDate',
        endDate.toISOString());
    }
    
    return this.httpClient.get<any>
    ( query.getString() );
    
  }
  
  public getTimeFrames(

    senderID : number,
    recipientID? : number,
    startDate? : Date,
    endDate? : Date

  ) : Observable<any>
  {

    let query = new Query(this.API_URL);

    query.addPath(this.API_VERSION);
    query.addPath(this.API_TIMESTREAM_CONTROLLER);
    
    // Required Parameters
    query.addParameter(
      'senderID',
      senderID);
    
    // Optional Parameters
    if ( recipientID ){
      query.addParameter(
        'recipientID',
        recipientID);
    }

    if ( startDate ){
      query.addParameter(
        'startDate',
        startDate.toISOString()
        )
    }

    if ( endDate ){
      query.addParameter(
        'endDate',
        endDate.toISOString()
        );
    }

    return this.httpClient.get<any>
    ( query.getString() );

  }

  public getEmailView(

    senderID: number,
    recipientID?: number,
    startDate?: Date,
    endDate?: Date

  ){
    
    let query = new Query( this.API_URL);
    query.addPath( this.API_VERSION );
    query.addPath( this.API_EMAIL_VIEW_CONTROLLER );

    // Required Parameters
    query.addParameter('senderID',senderID);
    
    // Optional Parameters
    if ( recipientID ){
      query.addParameter(
        'recipientID',
        recipientID);
    }
    
    if ( startDate ){
      query.addParameter(
        'startDate',
        startDate.toISOString());
    }

    if ( endDate ) {
      query.addParameter(
        'endDate',
        endDate.toISOString());
    }
    
    return this.httpClient.get<any>
    ( query.getString() );

  }

  public getTimeSeries(

    senderID: number,
    recipientID?: number,
    startDate?: Date,
    endDate?: Date

  ){
    
    let query = new Query( this.API_URL);
    query.addPath( this.API_VERSION );
    query.addPath( this.API_TIMESERIES_CONTROLLER );

    // Required Parameters
    query.addParameter('senderID',senderID);
    
    // Optional Parameters
    if ( recipientID ){
      query.addParameter(
        'recipientID',
        recipientID);
    }
    
    if ( startDate ){
      query.addParameter(
        'startDate',
        startDate.toISOString());
    }

    if ( endDate ) {
      query.addParameter(
        'endDate',
        endDate.toISOString());
    }
    
    return this.httpClient.get<any>
    ( query.getString() );

  }

  constructor(private httpClient: HttpClient) {
  }
}