import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

export class AddBookingDto 
{
    @IsUUID()
    @IsNotEmpty()
    uuid: string;

    @IsUUID()
    @IsNotEmpty()
    vehicleUuid: string;

    @IsUUID()
    @IsOptional()
    alternateDriverUuid: string;

    @IsUUID()
    @IsNotEmpty()
    corporateUuid: string;

    @IsUUID()
    @IsNotEmpty()
    branchUuid: string;
    
    @IsUUID()
    @IsNotEmpty()
    slotsUuid: string;

    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(2)
    assignedTechnician: [string];
}