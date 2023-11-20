import { IsNotEmpty } from 'class-validator';

export class AddProductDto {
  @IsNotEmpty()
  produitId: number;
  @IsNotEmpty()
  userId: number;
  @IsNotEmpty()
  quantity: number;
}
