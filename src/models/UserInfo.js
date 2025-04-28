import { model, models, Schema } from "mongoose";

const UserInfoSchema = new Schema({
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    streetAddress: { type: String },
    city: { type: String },
    postalCode: { type: String },
    country: { type: String },
    admin: { type: Boolean, default: false }, 
}, { timestamps: true });

export default models?.UserInfo || model('UserInfo', UserInfoSchema);