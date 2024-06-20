import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
    propertyName:{
        type: String,
        require: true
    },
    address:{
        type: String,
        require: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true
    },
    description:{
        type: String,
    },
    type:{
        type: String,
        enum: ["rent", "sell"],
        require :true
    },
    price:{
        type: Number,
        require: true
    },
    furnished: {
        type: Boolean,
        require: true
    },
    parking:{
        type: Boolean,
        require: true
    },
    images: [{ 
      type: String 
    }],

      
    createdAt: {
        type: Date,
        default: Date.now,
      },

})

export const Property = mongoose.model("Property",propertySchema);