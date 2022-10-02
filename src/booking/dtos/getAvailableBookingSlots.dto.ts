import { ArrayMaxSize, IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsUUID } from "class-validator";

export class GetAvailableBookingSlotsDto 
{
    @IsUUID()
    corporateUuid: string;

    @IsUUID()
    branchUuid: string;
}