import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AgenceId = createParamDecorator((_data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest();
  return request.user?.agenceId;
});

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
