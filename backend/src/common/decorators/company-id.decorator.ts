import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CompanyId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // Get companyId from user (JWT) or from admin header
    return request.user?.companyId || request.headers['x-company-id'];
  },
);

