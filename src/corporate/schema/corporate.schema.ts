import * as mongoose from 'mongoose';

export const CorporateSchema = new mongoose.Schema ({
    uuid: String,
    name: String,
    country: String,
    address: String,
})