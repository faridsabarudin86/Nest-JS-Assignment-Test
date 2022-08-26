import { IsDefined, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class AddCorporateDto 
{
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