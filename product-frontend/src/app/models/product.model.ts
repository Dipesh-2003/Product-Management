import { Category } from './category.model';
export interface Product {
  id:number;
  productId:string;
  name:string;
  description:string;
  categoryId?:number
}