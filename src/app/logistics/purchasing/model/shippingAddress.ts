export class ShippingAddress {
    name: string;
    surname: string;
    address: string;
    
    city: string;
    state: string;
    ZIP: string;

    email:string;
    telephone: string;
    
    constructor(name: string, surname: string, address: string, 
                city: string, state: string, ZIP: string,
                email:string, telephone: string) {
        this.name = name;
        this.surname = surname;
        this.address = address;

        this.city = city;
        this.state = state;
        this.ZIP = ZIP;

        this.email = email;
        this.telephone = telephone;
    }

    static EMPTY: ShippingAddress = {
        name: '', surname: '', address: '', 
        city: '', state: '', ZIP: '',
        email: '', telephone: ''
    };
}
