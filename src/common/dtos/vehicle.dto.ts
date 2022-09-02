export class VehicleDto
{
    uuid?: string;
    ownerUuid?: string;
    
    information?:
    [{
        uuid?: string,
        alternateDrivers?: [string],
        brand?: string,
        model?: string,
        type?: string,
        colour?: string,
        plateNumber?: string,
        chassisNumber?: string,
    }]
}