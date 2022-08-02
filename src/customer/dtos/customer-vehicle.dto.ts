export class CustomerVehicleDto {
    uuid?: string;
    owner_uuid?: string;
    alternateDrivers_uuid?: string[];
    vehicleBrand?: string;
    vehicleModel?: string;
    vehicleType?: string;
    vehiclePlateNumber?: string;
    vehicleChassisNumber?: string;
    vehicleColour?: string;
}