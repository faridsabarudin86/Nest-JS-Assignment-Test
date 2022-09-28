import { SetMetadata } from "@nestjs/common";
import { UserRoles } from "src/common/config/userRoles";

export const Roles = (...roles: UserRoles[]) => SetMetadata('roles', roles);