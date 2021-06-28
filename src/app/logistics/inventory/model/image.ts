export class Image {
    id: number;
    mimetype: string;
    data: string;

    constructor(id: number, mimetype: string, data: string) {
        this.id = id;
        this.mimetype = mimetype;
        this.data = data;
    }

    static EMPTY: Image = { id: 0, mimetype: '', data: '' };
}