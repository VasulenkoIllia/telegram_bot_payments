import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserEntity } from '../../entities/user.entity';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../common/interfaces/user/role.enum';
import { cryptPasswordSync } from '../../common/utils/crypt.util';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async onModuleInit() {
    const user = await this.userRepo.findOne({
      where: {
        login: process.env.ADMIN_USER,
      },
    });
    console.log(user);
    if (!user) {
      await this.userRepo.save(
        this.userRepo.create({
          login: process.env.ADMIN_USER,
          password: cryptPasswordSync(process.env.ADMIN_PASSWORD),
          role: Role.ADMIN,
        }),
      );
      console.log('created');
    }
  }
  async findById(id: number): Promise<UserEntity | null> {
    return this.userRepo.findOne({
      where: { id },
    });
  }

  async findByEmail(login: string): Promise<UserEntity | null> {
    return this.userRepo.findOne({
      where: { login },
    });
  }
}
