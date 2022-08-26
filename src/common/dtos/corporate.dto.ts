import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsUUID } from "class-validator";

export class CorporateDto 
{
    @IsUUID(4)
    uuid: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    emailAddress: string;

    @IsNotEmpty()
    @IsString()
    headquartersAddress: string;

    @IsNotEmpty()
    @IsString()
    country: string;
}