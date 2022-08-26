import * as mongoose from 'mongoose';

export const VehicleSchema = new mongoose.Schema
({
    uuid: {type: String},
    ownerUuid: {type: String},
    information:
    [{
        uuid: {type: String},
        alternateDrivers: {type: [String]},
        brand: {type: String},
        model: {type: String},
        type: {type: String},
        colour: {type: String},
        plateNumber: {type: String},
        chassisNumber: {type: String},
    }],
})