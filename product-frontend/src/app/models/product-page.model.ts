import { Product } from "./product.model";

export interface ProductPage {
    content: Product[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}