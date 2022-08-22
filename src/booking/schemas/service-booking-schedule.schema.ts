import * as mongoose from 'mongoose';

export const ServiceBookingScheduleSchema = new mongoose.Schema ({
    uuid: String,
    corporateUuid: String,
    branchCorporateUuid: String,
    date: String,
    bookingSlots: [{
        uuid: String,
        customerUuid: String,
        vehicleUuid: String,
        status: String,
        startTime: String,
        endTime: String,
        assignedTechnicianUuid: [String],
    }],
    Technicians: [{
        uuid: String,
        status: String,
    }],
})