import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID, ValidateNested } from "class-validator";

export class UpdateVehicleDto
{
    @IsOptional()
    @IsString()
    colour: string;

    @IsOptional()
    @IsString()
    plateNumber: string;

    @IsOptional()
    @IsString()
    chassisNumber: string;
}