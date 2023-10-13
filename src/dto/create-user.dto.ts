import { IsEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmpty()
  @IsString()
  name: string;

  @IsEmpty()
  @IsString()
  email: string;

  @IsEmpty()
  @IsString()
  password: string;
}
