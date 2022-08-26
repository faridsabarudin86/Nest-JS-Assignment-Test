import { Type } from "class-transformer";
import { IsArray, IsEmail, IsNotEmpty, IsObject, IsString, IsUUID, ValidateNested } from "class-validator";

class WorkingHoursProperties
{
    @IsNotEmpty()
    @IsString()
    startWorkingHours: string;

    @IsNotEmpty()
    @IsString()
    endWorkingHours: string;

    @IsNotEmpty()
    @IsArray()
    offDays: [string];
}

export class AddBranchDto 
{
    uuid: string;
    
    @IsNotEmpty()
    @IsUUID(4)
    corporateUuid: string;

    branchUuid: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    emailAddress: string;

    @IsNotEmpty()
    @IsString()
    branchAddress: string;

    @ValidateNested({each: true})
    @Type(() => WorkingHoursProperties)
    workingHours: WorkingHoursProperties;
}