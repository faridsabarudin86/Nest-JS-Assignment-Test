import { IsEmail, IsEnum, IsNumber, IsObject, IsPhoneNumber, IsString, IsUUID, ValidateNested } from "class-validator";
import { UserRoles } from "src/common/config/userRoles";

export class UserDto {

    @IsUUID(4)
    uuid: string;

    @IsEmail()
    emailAddress: string;

    @IsString()
    password: string;

    @IsString()
    fullName: string;
    
    @IsPhoneNumber()
    phoneNumber: string;

    @IsString()
    role: string;

    corporate:
    {
        uuid: string;
        role: string;
        branch:
        [{
            uuid: string,
            role: string,
        }]
    }
}