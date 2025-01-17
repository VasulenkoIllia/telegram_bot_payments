import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedResultDTO } from '../dto/common/paginated-result.dto';
import { SearchParameterDTO } from '../dto/common/search-parameter.dto';

const valueTypes: string[] = [
  'Boolean',
  'Number',
  'String',
  'BigInt',
  'Symbol',
];

export const ApiResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) => {
  return applyDecorators(
    ApiExtraModels(dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              data: valueTypes.includes(dataDto.name)
                ? { type: dataDto.name.toLowerCase() }
                : { $ref: getSchemaPath(dataDto) },
            },
          },
        ],
      },
    }),
  );
};

export const ApiArrayResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) => {
  return applyDecorators(
    ApiExtraModels(dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              data: {
                type: 'array',
                items: valueTypes.includes(dataDto.name)
                  ? { type: dataDto.name.toLowerCase() }
                  : { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiPaginatedResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) => {
  return applyDecorators(
    ApiExtraModels(PaginatedResultDTO, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              data: {
                allOf: [
                  { $ref: getSchemaPath(PaginatedResultDTO) },
                  {
                    properties: {
                      items: {
                        type: 'array',
                        items: valueTypes.includes(dataDto.name)
                          ? { type: dataDto.name.toLowerCase() }
                          : { $ref: getSchemaPath(dataDto) },
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    }),
  );
};

export const SearchParameterGeneric = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) => {
  return applyDecorators(
    ApiExtraModels(SearchParameterDTO, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SearchParameterDTO) },
          {
            properties: {
              searchBy: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  );
};
