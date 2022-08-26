import { IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CorporateBranchDto
{
    @IsUUID(4)
    uuid: string;
    
    @IsNotEmpty()
    @IsUUID(4)
    corporateUuid: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    emailAddress: string;

    @IsNotEmpty()
    @IsString()
    branchAddress: string;

    @IsNotEmpty()
    @IsString()
    startWorkingHours: string;

    @IsNotEmpty()
    @IsString()
    endWorkingHours: string;

    @IsNotEmpty()
    @IsString()
    offDays: [string];
}