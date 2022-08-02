import * as mongoose from 'mongoose';

export const CorporateSchema = new mongoose.Schema ({
    uuid: String,
    corporateName: String,
    corporateCountry: String,
    corporateAddress: String,
})