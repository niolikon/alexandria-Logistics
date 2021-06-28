export class Product {
    id: number;
    name: string;
    description: string;
    label: string;
    imageIds: string[];
    price: number;
    type: string;

    constructor(id: number, name: string, description: string,
        label: string, imageIds: string[], price: number, type: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.label = label;
        this.imageIds = imageIds;
        this.price = price;
        this.type = type;
    }

    static EMPTY: Product = {
        id: 0, name: '', description: '',
        label: '', imageIds: [], price: 0,
        type: ''
    };
}

export class ProductRequest {
    id: number;
    name: string;
    description: string;
    label: string;
    price: number;
    type: string;

    constructor(id: number, name: string, description: string,
        label: string, imageIds: string[], price: number, type: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.label = label;
        this.price = price;
        this.type = type;
    }

    static EMPTY: ProductRequest = {
        id: 0, name: '', description: '',
        label: '', price: 0,
        type: ''
    };
}