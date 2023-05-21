import mongoose from "mongoose";

const Schema = mongoose.Schema;

const accountSchema =  new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date_registered:{
        type: String,
        required: true
    }
})

export default mongoose.model('Account', accountSchema)