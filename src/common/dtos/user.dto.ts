import { IsEmail, IsEnum, IsNumber, IsObject, IsPhoneNumber, IsString, IsUUID, ValidateNested } from "class-validator";
import { UserRoles } from "src/common/config/userRoles";

export class UserDto {

    uuid?: string;
    emailAddress?: string;
    password?: string;
    fullName?: string;
    phoneNumber?: string;
    role?: string;

    corporate?:
    {
        uuid?: string;
        role?: string;
        branch?:
        [{
            uuid?: string,
            role?: string,
        }]
    }
}