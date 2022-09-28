import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID, ValidateNested } from "class-validator";

export class DeleteVehicleDto
{
    @IsUUID(4)
    uuid: string;
}