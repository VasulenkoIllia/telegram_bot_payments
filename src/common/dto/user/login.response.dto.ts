import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginResponseDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  public accessToken: string;
}
