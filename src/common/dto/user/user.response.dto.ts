import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserEntity } from '../../../entities/user.entity';
import { AutoMap } from '@automapper/classes';

export class UserResponseDTO {
  @IsNumber()
  @IsNotEmpty()
  @AutoMap()
  @ApiProperty({ required: true })
  public id: number;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @AutoMap()
  @MinLength(8)
  @MaxLength(128)
  @ApiProperty({ required: true })
  public login: string;
}

@Injectable()
export class UserAutomapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap<UserEntity, UserResponseDTO>(
        mapper,
        UserEntity,
        UserResponseDTO,
      );
    };
  }
}
