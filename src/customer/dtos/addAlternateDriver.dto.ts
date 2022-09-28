import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID, ValidateNested } from "class-validator";

export class AddAlternateDriverDto
{
    @IsNotEmpty()
    @IsUUID(4)
    uuid: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}