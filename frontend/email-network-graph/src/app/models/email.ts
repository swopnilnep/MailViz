export class Email {
    id: number;
    sender: Person;
    recipient: Person;
    date: Date;
}

export class Person {
    id: number;
    emailAddress: string;
    emailName: string;
}