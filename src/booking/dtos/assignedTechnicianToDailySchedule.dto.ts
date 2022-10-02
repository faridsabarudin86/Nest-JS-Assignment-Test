import { ArrayMaxSize, IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsUUID } from "class-validator";

export class AssignTechnicianToDailyScheduleDto 
{
    @IsArray()
    @ArrayMaxSize(10)
    techniciansOfTheDay: string[];
}