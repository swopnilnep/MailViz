import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkSelectionService {

  // 
  // Private Fields
  // 

  private myDoubleClickedSenderID : 
    Subject< number >;

  private myDoubleClickedRecipientID : 
    Subject< number >;

  // 
  // Public Accessors
  // 

  public getSenderID(){
    return this.myDoubleClickedSenderID;
  }

  public getRecipientID(){
    return this.myDoubleClickedRecipientID;
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
      .next( Number.MIN_VALUE );
    }
    
    public resetSender(){
      this.myDoubleClickedSenderID
      .next( Number.MIN_VALUE );
    }
    
  // 
  // Constructor
  // 

  constructor() { }
}
