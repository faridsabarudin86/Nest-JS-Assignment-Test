import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID, ValidateNested } from "class-validator";

export class UpdateVehicleDto
{

    @IsNotEmpty()
    @IsUUID(4)
    uuid: string;

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