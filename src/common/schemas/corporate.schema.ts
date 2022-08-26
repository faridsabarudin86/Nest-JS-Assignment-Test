import * as mongoose from 'mongoose';

export const CorporateSchema = new mongoose.Schema
({
    uuid: {type: String},
    name: {type: String},
    emailAddress: {type: String},
    headquartersAddress: {type: String},
    country: {type: String},
})