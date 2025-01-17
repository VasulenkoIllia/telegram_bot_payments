import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResultDTO<T> {
  @ApiProperty()
  public totalCount: number;

  @ApiProperty()
  public totalPages: number;

  @ApiProperty()
  public pageNumber: number;

  @ApiProperty()
  public pageSize: number;

  @ApiProperty()
  public items: T[];
}
