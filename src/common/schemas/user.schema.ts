import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema
({
    uuid: {type: String},
    emailAddress: {type: String},
    password: {type: String},
    fullName: {type: String},
    phoneNumber: {type: String},
    role: {type: String},
    corporate:
    [{
        uuid: {type: String},
        role: {type: String},
        branch:
        [{
            uuid: {type: String},
            role: {type: String},
        }]
    }]
})