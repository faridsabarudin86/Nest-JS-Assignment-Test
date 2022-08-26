import { CanActivate, ExecutionContext, Inject, Injectable, Scope } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRoles } from "src/common/config/userRoles";


@Injectable({scope: Scope.REQUEST})
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {

        const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>( 'roles', [ context.getHandler(), context.getClass() ]);

        if(!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        return requiredRoles.some((role) => user.userRole?.includes(role));
    }
}