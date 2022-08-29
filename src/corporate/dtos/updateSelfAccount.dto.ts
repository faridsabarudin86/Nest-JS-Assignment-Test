import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID, ValidateNested } from "class-validator";

export class UpdateSelfAccountDto
{
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