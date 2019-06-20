import { Person } from './person';
import { Interaction } from './interaction';

export class VisNode {
    
    // Public Fields
    
    public id: number;
    public label: string;

    // Private Mutators
    private setId(other: number): void {
        this.id = other;
    }

    private setLabel(other: string): void {
        this.label = other;
    }

    // Ctors
    constructor(person: Person){
        this.setId(person.id);
        this.setLabel( (person.emailsReceived + person.emailsSent).toString() );
    }

}

export class VisEdge {
    
    // Class Fields
    public from: number;
    public to: number;
    
    // Private Mutators
    private setFrom(other : number): void {
        this.from = other;
    }

    private setTo(other: number): void {
        this.to = other;
    }

    // Ctors
    constructor(interaction : Interaction){
        this.setFrom(interaction.senderID);
        this.setTo(interaction.recepientID);
    }
}
