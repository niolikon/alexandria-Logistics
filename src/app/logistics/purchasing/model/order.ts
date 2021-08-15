import { ShippingAddress } from "./shippingAddress";

export class OrderEntry {
    productId: number;
    quantity: number;

    constructor(productId: number, quantity: number) {
        this.productId = productId;
        this.quantity = quantity;
    }

    static EMPTY: OrderEntry = {
        productId: -1, quantity: -1
    };
};

export enum OrderStatus { 
    NEW = 'NEW', 
    PACKING = 'PACKING', 
    SHIPPED = 'SHIPPED'
};

export class Order {
    id: number;
    username: string;
    entries: OrderEntry[];
    address: ShippingAddress;
    status: OrderStatus;
    creationTime: Date;
    updateTime: Date;
    
    constructor(id: number, username: string, entries: OrderEntry[],
        address: ShippingAddress, status: OrderStatus, 
        creationTime:Date, updateTime:Date) {
        this.id = id;
        this.username = username;
        this.entries = entries;
        this.address = address;
        this.status = status;
        this.creationTime = creationTime;
        this.updateTime = updateTime;
    }

    itemsCount():number {
        let result:number = 0;

        for(let entry of this.entries) {
            result += entry.quantity;
        }

        return result;
    }

    static fromJSObject(order:any): Order {
        let result:Order = new Order(order.id as number, order.username as string, order.entries as OrderEntry[],
            order.address as ShippingAddress, order.status as OrderStatus, 
            order.creationTime as Date, order.updateTime as Date);
        return result;
    }

    static EMPTY: Order = new Order(0, '', [],
        ShippingAddress.EMPTY, OrderStatus.NEW,
        new Date(), new Date());
}

export class OrderRequest {
    entries: OrderEntry[];
    address: ShippingAddress;
    status: OrderStatus;
    
    constructor(entries: OrderEntry[], address: ShippingAddress, 
        status: OrderStatus) {
        this.entries = entries;
        this.address = address;
        this.status = status;
    }

    static fromOrder(order: Order):OrderRequest {
        let result = new OrderRequest(order.entries, order.address, order.status);
        return result;
    }

    static EMPTY: OrderRequest = { entries: [], address: ShippingAddress.EMPTY, 
        status:OrderStatus.NEW,
    };
}