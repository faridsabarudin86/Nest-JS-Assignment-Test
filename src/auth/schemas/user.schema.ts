import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema ({
    uuid: String,
    emailAddress: String,
    password: String,
    fullName: String,
    userType: String,
    corporateUuid: [String],
    corporateBranchUuid: [String],
})