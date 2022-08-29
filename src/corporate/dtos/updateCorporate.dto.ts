import { IsDefined, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateCorporateDto 
{
    @IsNotEmpty()
    @IsUUID(4)
    uuid: string;

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    emailAddress: string;

    @IsOptional()
    @IsString()
    headquartersAddress: string;

    @IsOptional()
    @IsString()
    country: string;
}