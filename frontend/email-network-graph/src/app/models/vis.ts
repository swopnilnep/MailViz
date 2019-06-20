import { Person } from './person';
import { Interaction } from './interaction';

export class VisNode {
    
    // Public Fields
    
    public id: number;
    public label: string;
    public value: number;
    // public cid:number;
    // public color:string;

    // Private Mutators
    public setId(other: number): void {
        this.id = other;
    }

    public setLabel(other: string): void {
        this.label = other;
    }

    public setValue(other: number): void {
        this.value = other;
    }

    // Ctors
    constructor(person: Person){
        if (person){
            this.setId(person.id);
            this.setLabel(person.emailName);
            this.setValue(person.emailsSent + person.emailsReceived);
        }
    }

}

export class VisEdge {
    
    // Class Fields
    public from: number;
    public to: number;
    public title: string;
    public value: number;
    
    // Private Mutators
    private setFrom(other : number): void {
        this.from = other;
    }

    private setTo(other: number): void {
        this.to = other;
    }

    private setTitle(other : string): void {
        this.title = other;
    }

    private setValue(other: number): void {
        this.value = other;
    }

    // Ctors
    constructor(interaction : Interaction){
        this.setFrom(interaction.senderID);
        this.setTo(interaction.recepientID);
        this.setTitle(interaction.emailCount + ' emails were exchanged');
        this.setValue(interaction.emailCount);
    }
}
