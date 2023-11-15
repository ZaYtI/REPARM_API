import { IsString, IsNumber, IsNotEmpty, IsBoolean } from 'class-validator';
export class NewProductDto {
  @IsNotEmpty()
  @IsNumber()
  naturaBuyId: number;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  barrePrice: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  duree: number;

  @IsNotEmpty()
  @IsBoolean()
  new: boolean;

  @IsNotEmpty()
  @IsBoolean()
  stock: boolean;

  @IsNotEmpty()
  @IsString()
  ean: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  categorieId: number;
}
