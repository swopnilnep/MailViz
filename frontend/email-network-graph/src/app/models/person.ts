export class Person {
    id: number;
    emailName: string;
    emailAddress: string;
    domainName: string;
    totalEmails: number;    

    constructor(d : any) {
        this.id = d.id;
        this.emailName = d.emailName;
        this.emailAddress = d.emailAddress;
        this.domainName = d.domainName;
        this.totalEmails = d.totalEmails;
    }
}

export class PersonMap extends Map<number, Person> {
    
    get(id : number) : Person {
        // Returns the 'Person' object matching
        // the id passed as a parameter
        return super.get(id);
    }

    getAllIds() : Array<number> {
        // Returns all the ids of the People in the Map
        return Array.from(this.keys());
    }

    toArray() : Array<Person> {
        // Returns an array of 'Person' objects based
        // on the items in the Map
        let pArray = new Array<Person>();
        this.getAllIds().forEach(pid => {
            pArray.push(this.get(pid))
        })
        
        return pArray;
    }

    hasPerson(person : Person) {
        // Has function implemented by taking in a
        // a 'Person' object parameter
        return this.has(person.id);
    }

    hasPersonId(pid : number) {
        // Has function implemented by taking in a
        // Person id parameter
        return this.has(pid);
    }

}