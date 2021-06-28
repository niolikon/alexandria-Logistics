export class Company {
    id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    static EMPTY: Company = { id: 0, name: '' };
}