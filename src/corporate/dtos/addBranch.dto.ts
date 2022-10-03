import { Type } from "class-transformer";
import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsObject, IsString, IsUUID, ValidateNested } from "class-validator";

export class AddBranchDto 
{
    uuid: string;

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

    startWorkingHours: Date;

    endWorkingHours: Date;

    @IsNotEmpty()
    @IsNumber()
    startWorkingHours_Hours: number;

    @IsNotEmpty()
    @IsNumber()
    startWorkingHours_Minutes: number;

    @IsNotEmpty()
    @IsNumber()
    endWorkingHours_Hours: number;

    @IsNotEmpty()
    @IsNumber()
    endWorkingHours_Minutes: number;

    @IsNotEmpty()
    @IsArray()
    offDays: number[];
}