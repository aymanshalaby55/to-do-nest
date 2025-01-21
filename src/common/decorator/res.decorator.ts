import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Response } from 'express';

export const Res = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const response = ctx.switchToHttp().getResponse<Response>();
    return response;
  },
);
