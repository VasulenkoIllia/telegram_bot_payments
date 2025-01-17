import {
  CanActivate,
  ExecutionContext, ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { Request } from "express";
import { IJwtPayload } from "../../../common/interfaces/common/jwt-payload.interface";
import { appConfigInstance } from "../../../infrastructure/app-config/app-config.infrastructure";
import { JwtService } from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";
import {IS_PUBLIC_KEY} from "./public.guard";
import {IS_ADMIN_KEY} from "./admin.guard";
import {Role} from "../../../common/interfaces/user/role.enum";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(
          token,
          {
            secret: process.env.JWT_SECRET
          }
      );

      const isAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);


      if (isAdmin && payload.role !== Role.ADMIN) {
        throw new ForbiddenException();
      }
      console.log(payload)
      request['user'] = payload;

    } catch (e) {
      console.log(e)
      throw new UnauthorizedException();
      return  false;
    }
    return  true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
