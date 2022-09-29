import { IsArray, IsDefined, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateCorporateBranchDto 
{
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    emailAddress: string;

    @IsOptional()
    @IsString()
    branchAddress: string;

    @IsOptional()
    @IsNumber()
    startWorkingHours_Hours: number;

    @IsOptional()
    @IsNumber()
    startWorkingHours_Minutes: number;

    @IsOptional()
    @IsNumber()
    endWorkingHours_Hours: number;

    @IsOptional()
    @IsNumber()
    endWorkingHours_Minutes: number;

    @IsOptional()
    @IsNumber()
    startWorkingHours: Date;

    @IsOptional()
    @IsNumber()
    endWorkingHours: Date;

    @IsOptional()
    @IsArray()
    offDays: number[];
}