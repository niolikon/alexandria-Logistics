export class Product {
    id: number;
    name: string;
    description: string;
    label: string;
    image: string;
    price: number;
    
    constructor(id: number, name: string, description: string,
        label: string, image: string, price: number) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.label = label;
        this.image = image;
        this.price = price;
    }
}