import * as mongoose from 'mongoose';

export const CustomerVehicleSchema = new mongoose.Schema ({
    uuid: String,
    ownerUuid: String,
    alternateDriversUuid: [String],
    brand: String,
    model: String,
    type: String,
    plateNumber: String,
    chassisNumber: String,
    colour: String,
})