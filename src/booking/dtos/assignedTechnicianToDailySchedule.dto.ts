import { ArrayMaxSize, IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsUUID } from "class-validator";

export class AssignTechnicianToDailyScheduleDto 
{
    @IsUUID()
    @IsNotEmpty()
    uuid: string;

    @IsUUID()
    @IsNotEmpty()
    corporateUuid: string;

    @IsUUID()
    @IsNotEmpty()
    branchUuid: string;
    
    @IsArray()
    @ArrayMaxSize(10)
    techniciansOfTheDay: string[];
}