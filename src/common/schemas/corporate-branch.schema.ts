import * as mongoose from 'mongoose';

export const CorporateBranchSchema = new mongoose.Schema
({
    uuid: {type: String},
    corporateUuid: {type: String},
    name: {type: String},
    emailAddress: {type: String},
    branchAddress: {type: String},
    startWorkingHours: {type: Date},
    endWorkingHours: {type: Date},
    offDays: {type: [Number]},
})