import Listing from "../model/listing.js"
import { handelError } from "../utils/error.js"

export const createListing = async (req, res, next) => {

    try {
        const listing = await Listing.create(req.body)
        return res.status(201).json(listing)

    } catch (error) {
        next(error)

    }
}

export const deleteProperty = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(handelError(404, 'Listing not found!'));
    }



    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('Listing has been deleted!');
    } catch (error) {
        next(error);
    }
};

export const updateProperty = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return next(handelError(404, 'Listing not found!'));
    }


    try {
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedListing);
    } catch (error) {
        next(error);
    }
};

export const getProperty = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(handelError(404, 'Listing not found!'));
        }
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
};

export const getSearchProperty = async (req, res, next) => {

    try {
        const listings = await Listing.find().exec();
        return res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
};
