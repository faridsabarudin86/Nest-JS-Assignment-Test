import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID, ValidateNested } from "class-validator";

export class UpdateEmployeeDto
{
    @IsNotEmpty()
    @IsUUID(4)
    uuid: string;

    @IsNotEmpty()
    @IsUUID(4)
    branchUuid: string;

    @IsNotEmpty()
    @IsUUID(4)
    corporateUuid: string;

    @IsEmail()
    @IsOptional()
    emailAddress: string;

    @IsString()
    @IsOptional()
    password: string;

    @IsString()
    @IsOptional()
    fullName: string;
    
    @IsOptional()
    phoneNumber: string;
}