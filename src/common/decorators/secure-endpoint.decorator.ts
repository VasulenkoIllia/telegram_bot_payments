import { applyDecorators, RequestMethod } from '@nestjs/common';
import { Endpoint } from './endpoint.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common/decorators';
import { JwtGuard } from '../../components/auth/guards/jwt.guard';

export const SecureEndpoint = (
  route: string,
  httpRequestMethod: RequestMethod = RequestMethod.POST,
) => {
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(JwtGuard),
    Endpoint(route, httpRequestMethod),
  );
};
