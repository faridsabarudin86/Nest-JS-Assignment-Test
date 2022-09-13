import * as mongoose from 'mongoose';

export const ServiceBookingSchema = new mongoose.Schema
({
    uuid: {type: String},
    corporateUuid: {type: String},
    branchUuid: {type: String},
    date: {type: Date},
    techniciansOfTheDay: {type: [String], validate: [arrayLimit, '{PATH} exceeds the limit of 10']},
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

function arrayLimit(val) 
{
    return val.length <= 10;
}