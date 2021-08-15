export class Product {
    id: number;
    name: string;
    description: string;
    label: string;
    imageIds: string[];
    price: number;
    type: string;
    featured: boolean;

    constructor(id: number, name: string, description: string,
        label: string, imageIds: string[], price: number, type: string, 
        featured: boolean) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.label = label;
        this.imageIds = imageIds;
        this.price = price;
        this.type = type;
        this.featured = featured;
    }

    static EMPTY: Product = {
        id: 0, name: '', description: '',
        label: '', imageIds: [], price: 0,
        type: '', featured: false
    };
}

export class ProductRequest {
    id: number;
    name: string;
    description: string;
    label: string;
    price: number;
    type: string;
    featured: boolean;

    constructor(id: number, name: string, description: string,
        label: string, price: number, type: string, 
        featured: boolean) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.label = label;
        this.price = price;
        this.type = type;
        this.featured = featured;
    }

    static fromJSObject(product:any):ProductRequest {
        let result:ProductRequest = new ProductRequest(product.id as number, 
            product.name as string, product.description as string,
            product.label as string,  
            product.price as number, product.type as string, 
            product.featured as boolean);
        return result;
    }

    static fromProduct(product:Product):ProductRequest {
        let result:ProductRequest = new ProductRequest(product.id, 
            product.name, product.description,
            product.label,  
            product.price, product.type, 
            product.featured);
        return result;
    }

    static EMPTY: ProductRequest = {
        id: 0, name: '', description: '',
        label: '', price: 0,
        type: '', featured: false
    };
}