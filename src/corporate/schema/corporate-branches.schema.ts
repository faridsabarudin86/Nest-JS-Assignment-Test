import * as mongoose from 'mongoose';

export const CorporateBranchesSchema = new mongoose.Schema ({
    uuid: String,
    corporate_uuid: String,
    branchName: String,
    branchAddress: String,
})