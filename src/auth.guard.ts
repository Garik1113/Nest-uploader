import {
  Injectable,
  Inject,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('AUTH_MICROSERVICE')
    private readonly userServiceClient: ClientProxy,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles || !roles.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (!authorization) throw UnauthorizedException;
    const userInfo = await firstValueFrom(
      this.userServiceClient.send('get_user_roles', {
        access_token: request.headers.authorization.split(' ')[1],
      }),
    );
    if (!userInfo) throw UnauthorizedException;
    const userRoles = userInfo.roles;

    return roles.some((r) => userRoles.includes(r));
  }
}
