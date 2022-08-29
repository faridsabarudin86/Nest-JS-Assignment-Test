import { IsUUID } from "class-validator";

export class VehicleDto
{
    @IsUUID(4)
    uuid: string;

    @IsUUID(4)
    ownerUuid: string;
    
    information:
    [{
        uuid: string,
        alternateDrivers: [string],
        brand: string,
        model: string,
        type: string,
        colour: string,
        plateNumber: string,
        chassisNumber: string,
    }]
}