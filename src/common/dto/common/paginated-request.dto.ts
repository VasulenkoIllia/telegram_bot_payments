import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PaginatedRequestDTO {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  pageSize: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  pageNumber: number;
}
