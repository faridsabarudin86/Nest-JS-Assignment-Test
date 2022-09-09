import * as mongoose from 'mongoose';

export const ServiceBookingSchema = new mongoose.Schema
({
    uuid: {type: String},
    corporateUuid: {type: String},
    branchUuid: {type: String},
    date: {type: Date},
    techniciansOfTheDay: {type: [String]},
    slots:
    [{
        uuid: {type: String},
        startTime: {type: Date},
        endTime: {type: Date},
        customerUuid: {type: String},
        alternateDriverUuid: {type: String},
        vehicleUuid: {type: String},
        assignedTechnician: {type: [String]},
    }]
})