import { IsNotEmpty } from 'class-validator';

export class RequestAddProductDto {
  @IsNotEmpty()
  produitId: number;

  @IsNotEmpty()
  quantity: number;
}
