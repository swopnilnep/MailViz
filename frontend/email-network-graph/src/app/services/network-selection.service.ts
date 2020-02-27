import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkSelectionService {

  // 
  // Private Fields
  // 

  private myDoubleClickedSenderID : 
    BehaviorSubject< number > = 
      new BehaviorSubject< number >(Number.MIN_VALUE);

  private myDoubleClickedRecipientID : 
    BehaviorSubject< number > = 
      new BehaviorSubject< number >(Number.MIN_VALUE);

  // 
  // Public Accessors
  // 

  public getSender(){
    return this
      .myDoubleClickedSenderID;
  }

  public getRecipient(){
    return this
      .myDoubleClickedRecipientID;
  }

  // 
  // Public Mutators
  // 
  
  public assignSender(id : number){
    this.myDoubleClickedSenderID
    .next( id );
  }
  
  public assignRecipient( id : number ){
    this.myDoubleClickedRecipientID
    .next( id );
  }
  
  public resetRecipient(){
    this.myDoubleClickedRecipientID
    .next( null );
  }
  
  public resetSender(){
    this.myDoubleClickedSenderID
    .next( null );
  }
    
  // 
  // Constructor
  // 

  constructor() { }
}
