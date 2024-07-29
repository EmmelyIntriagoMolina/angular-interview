export interface IProducto {
    id:             string;
    name:           string;
    description:    string;
    logo:           string;
    date_release:   Date;
    date_revision:  Date;
}

export interface IResponseProduct {
    message:    string,
    data?:      IProducto,
    error?:     IErrorProduct
}

export interface IErrorProduct {
    name:       string;
    message:    string
}