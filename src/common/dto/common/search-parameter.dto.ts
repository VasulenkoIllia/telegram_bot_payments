import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SearchParameterDTO<T> {
  @ApiProperty({ required: false })
  public searchQuery?: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  public searchBy: T;
}
