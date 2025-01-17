import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginRequestDTO {
  @IsString()
  @ApiProperty({ required: true })
  public login: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  public password: string;
}
