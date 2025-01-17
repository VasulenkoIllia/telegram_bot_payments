import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDTO {
  @ApiProperty()
  public success: boolean;

  @ApiProperty()
  public statusCode: number;

  @ApiProperty()
  public data?: unknown = null;

  @ApiProperty()
  public error?: Error = null;

  constructor(statusCode = 200, success = true) {
    this.success = success;
    this.statusCode = statusCode;
  }
}

export class ApiResponseExceptionDTO extends ApiResponseDTO {
  constructor(errorCode: string, statusCode: number) {
    super(statusCode, false);
    this.error = new Error(errorCode);
  }
}

export class ApiResponseGenericDTO<T> extends ApiResponseDTO {
  @ApiProperty()
  public data: T;

  constructor(data: T, statusCode = 200) {
    super(statusCode, true);
    this.data = data;
  }
}
