import { Type } from "class-transformer";
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID, ValidateNested } from "class-validator";

class BranchProperties
{
    uuid: string;

    @IsNotEmpty()
    @IsString()
    role: string;
}

class CorporateProperties
{

    uuid: string;
    role: string;

    @ValidateNested({each: true})
    @Type(() => BranchProperties)
    branch: BranchProperties[]
}

export class AddEmployeeDto 
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