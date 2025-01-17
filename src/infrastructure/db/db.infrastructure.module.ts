import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db.data-source';
import { DbInfrastructure } from './db.infrastructure';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
      logging: false,
    }),
  ],
  providers: [DbInfrastructure],
})
export class DbInfrastructureModule {}
