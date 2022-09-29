import { IsDefined, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateCorporateDto 
{
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