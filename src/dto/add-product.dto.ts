import { IsNotEmpty } from 'class-validator';

export class AddProductDto {
  @IsNotEmpty()
  produitId: number;
  @IsNotEmpty()
  panierId: number;
  @IsNotEmpty()
  quantity: number;
}
