import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID, ValidateNested } from "class-validator";

export class RemoveAlternateDriverDto
{
    @IsUUID(4)
    uuid: string;
    
    @IsNotEmpty()
    @IsUUID(4)
    customerUuid: string;
}