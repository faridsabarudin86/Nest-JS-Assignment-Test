import { Type } from "class-transformer";
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID, ValidateNested } from "class-validator";

class CorporateProperties
{

    uuid: string;
    role: string;

    @ValidateNested({each: true})
    @Type(() => BranchProperties)
    branch: BranchProperties[]
}

class BranchProperties
{
    uuid: string;
    role: string;
}

export class AddEmployeeDto 
{
    uuid: string;
    
    @IsNotEmpty()
    @IsUUID(4)
    corporateUuid: string;

    @IsNotEmpty()
    @IsUUID(4)
    branchUuid: string;

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