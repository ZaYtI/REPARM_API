import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({ description: 'The user postal code' })
  postalCode: string;

  @ApiProperty({ description: 'The user nick' })
  @IsNotEmpty()
  @IsString()
  nick: string;

  @ApiProperty({ description: 'The user civility' })
  @IsNotEmpty()
  @IsString()
  civility: string;

  @ApiProperty({ description: 'The user first name' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'The user last name' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'The user birth date' })
  @IsNotEmpty()
  @IsDate()
  birthDate: Date;

  @ApiProperty({ description: 'The user address' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ description: 'The user city' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ description: 'The user country' })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({ description: 'The user phone number' })
  @IsNotEmpty()
  @IsPhoneNumber('FR')
  phone: string;

  @ApiProperty({ description: 'The user email' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The user password' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ description: 'the user avatar url' })
  @IsUrl()
  avatar: string;
}
