import { Type } from "class-transformer";
import { IsArray, IsEmail, IsNotEmpty, IsObject, IsPhoneNumber, IsString, IsUUID, ValidateNested } from "class-validator";

class CorporateProperties
{
    uuid: string;

    role: string;
}

export class AddCorporateAdminDto 
{
    uuid: string;

    @IsNotEmpty()
    @IsEmail()
    emailAddress: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    fullName: string;
    
    @IsNotEmpty()
    @IsPhoneNumber()
    phoneNumber: string;

    role: string;

    @ValidateNested({each: true})
    @Type(() => CorporateProperties)
    corporate: CorporateProperties[];
}