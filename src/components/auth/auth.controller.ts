import { Body, Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginResponseDTO } from '../../common/dto/user/login.response.dto';
import { LoginRequestDTO } from '../../common/dto/user/login.request.dto';
import { Endpoint } from '../../common/decorators/endpoint.decorator';
import { ApiResponse } from '../../common/decorators/api-response.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Endpoint('login')
  @ApiResponse(LoginResponseDTO)
  signIn(@Body() signInDto: LoginRequestDTO): Promise<LoginResponseDTO> {
    return this.authService.signIn(signInDto.login, signInDto.password);
  }
}
