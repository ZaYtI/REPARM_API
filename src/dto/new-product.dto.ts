import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
export class newProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNumber()
  @IsNotEmpty()
  price: number;
  @IsNumber()
  @IsNotEmpty()
  CategorieId: number;
}
