import { Module } from '@nestjs/common';
import { UserModule } from './components/user/user.module';
import { AuthModule } from './components/auth/auth.module';
import { AppConfigInfrastructureModule } from './infrastructure/app-config/app-config.infrastructure.module';
import { DbInfrastructureModule } from './infrastructure/db/db.infrastructure.module';
import { MappingInfrastructureModule } from './infrastructure/mapping/mapping.infrastructure.module';

@Module({
  imports: [
    AppConfigInfrastructureModule,
    DbInfrastructureModule,
    MappingInfrastructureModule.registerProfilesAsync(),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
