import * as mongoose from 'mongoose';

export const CorporateBranchesSchema = new mongoose.Schema ({
    uuid: String,
    corporateUuid: String,
    name: String,
    address: String,
    workingHours: {
        startWorkingHours: Number,
        endWorkingHours: Number,
        dayOff: [String],
    }
})