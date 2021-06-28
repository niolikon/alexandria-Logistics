export class Person {
    id: number;
    name: string;
    surname: string;

    constructor(id: number, name: string, surname: string) {
        this.id = id;
        this.name = name;
        this.surname = surname;
    }

    static EMPTY: Person = { id: 0, name: '', surname: '' };
}