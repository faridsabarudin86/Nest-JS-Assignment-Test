import { Type } from "class-transformer";
import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsObject, IsString, IsUUID, ValidateNested } from "class-validator";

export class AddBranchDto 
{
    uuid: string;

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

    @IsNotEmpty()
    @IsNumber()
    startWorkingHours: number;

    @IsNotEmpty()
    @IsNumber()
    endWorkingHours: number;

    @IsNotEmpty()
    @IsArray()
    offDays: number[];
}