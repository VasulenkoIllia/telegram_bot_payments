import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { appConfigInstance } from '../../infrastructure/app-config/app-config.infrastructure';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: appConfigInstance.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: appConfigInstance.ACCESS_TOKEN_EXPIRES },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
