export class Interaction {
    senderID: number;
    recepientID: number;
    emailCount: number;

    constructor(d : any) {
        this.senderID = d.senderID;
        this.recepientID = d.recepientID;
        this.emailCount = d.emailCount;
    }
}