import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDTO } from '../../common/dto/user/login.response.dto';
import { IJwtPayload } from '../../common/interfaces/common/jwt-payload.interface';
import {
  confirmPassword,
  confirmPasswordSync,
} from '../../common/utils/crypt.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(login: string, password: string): Promise<LoginResponseDTO> {
    const user = await this.usersService.findByEmail(login);
    console.log(
      await confirmPassword(password, user?.password),
      confirmPasswordSync(password, user?.password),
    );
    const confirmPass = await confirmPassword(password, user?.password);
    if (!confirmPass) {
      throw new UnauthorizedException();
    }

    const payload: IJwtPayload = {
      id: user.id,
      login: user.login,
      role: user.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }
}
