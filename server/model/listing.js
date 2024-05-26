import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },

    bathrooms: {
        type: Number,
        required: true,
    },
    bedrooms: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    imageUrls: {
        type: Array,
        required: true,
    },
    hospitals: {
        type: Number,
        required: true,
    },
    college: {
        type: Number,
        required: true,
    },
    contactNumber: {
        type: Number,
        // required: true,
    },
    price: {
        type: Number,
        required: true,
    },

    userData: {
        type: String,
        required: true,
    }
}, { timestamps: true })

const Listing = mongoose.model('Listing', listingSchema)

export default Listing;