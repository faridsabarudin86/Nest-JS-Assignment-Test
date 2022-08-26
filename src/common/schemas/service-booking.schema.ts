import * as mongoose from 'mongoose';

export const ServiceBookingSchema = new mongoose.Schema
({
    uuid: {type: String},
    corporateUuid: {type: String},
    branchUuid: {type: String},
    date: {type: Date},
    day: {type: String},
    slots:
    [{
        startTime: {type: Number},
        endTime: {type: Number},
        duration: {type: Number},
    }]
})