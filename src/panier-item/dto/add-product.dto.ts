import { IsNotEmpty } from 'class-validator';

export class AddProductDto {
  @IsNotEmpty()
  produitId: number;
  @IsNotEmpty()
  quantity: number;
}
