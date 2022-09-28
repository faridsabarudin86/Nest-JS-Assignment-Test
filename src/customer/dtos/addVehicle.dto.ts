import { Type } from "class-transformer";
import { IsEmail, IsEmpty, IsNotEmpty, IsPhoneNumber, IsString, IsUUID, ValidateNested } from "class-validator";

class VehiclePropeties
{
    uuid: string;

    @IsNotEmpty()
    @IsString()
    brand: string;

    @IsNotEmpty()
    @IsString()
    model: string;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsString()
    colour: string;

    @IsNotEmpty()
    @IsString()
    plateNumber: string;

    @IsNotEmpty()
    @IsString()
    chassisNumber: string;
}

export class AddVehicleDto
{
    uuid: string;
    ownerUuid: string;

    @ValidateNested({each: true})
    @Type(() => VehiclePropeties)
    information: VehiclePropeties[]
}