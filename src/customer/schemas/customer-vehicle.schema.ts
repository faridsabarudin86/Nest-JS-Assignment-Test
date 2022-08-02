import * as mongoose from 'mongoose';

export const CustomerVehicleSchema = new mongoose.Schema ({
    uuid: String,
    owner_uuid: String,
    alternateDrivers_uuid: [String],
    vehicleBrand: String,
    vehicleModel: String,
    vehicleType: String,
    vehiclePlateNumber: String,
    vehicleChassisNumber: String,
    vehicleColour: String,
})