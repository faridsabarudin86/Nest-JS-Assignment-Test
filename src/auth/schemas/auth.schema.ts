import * as mongoose from 'mongoose';

export const AuthSchema = new mongoose.Schema ({
    uuid: String,
    emailAddress: String,
    password: String,
    fullName: String,
    userType: String,
    corporate_uuid: String,
    corporateBranch_uuid: String,
})