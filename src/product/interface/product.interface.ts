export interface ProductInterface {
  id: number;
  naturaBuyId: string;
  name: string;
  price: number;
  barrePrice: number;
  description: string;
  categorieId: number;
  quantity: number;
  duree: number;
  new: boolean;
  stock: boolean;
  ean: string;
  createdAt: Date;
  updatedAt: Date;
}
