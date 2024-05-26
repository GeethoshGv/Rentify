import { handelError } from "../utils/error.js"
import bcryptjs from 'bcryptjs'
import User from "../model/user.js"
import Listing from "../model/listing.js"

export const test = (req, res) => {
    res.json({
        message: "iam batman"
    })
}

export const updateUser = async (req, res, next) => {

    if (req.user.id !== req.params.id) return next(handelError(401, "you can access only your account"))

    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                password: req.body.password,
                phone: req.body.phone,
                email: req.body.email,
                avatar: req.body.avatar
            }
        }, { new: true })

        const { password, ...restOfTheData } = updatedUser._doc


        res.status(200).json(restOfTheData)


    } catch (error) {
        next(error)

    }

}
export const deleteUser = async (req, res, next) => {

    if (req.user.id === req.params.id) return next(handelError(401, "you can delete only your account"))

    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json('user deleted')

    } catch (error) {
        next(error)

    }



}

export const getUserProperty = async (req, res, next) => {


    try {

        const property = await Listing.find({ userData: req.params.id })
        res.status(200).json(property)

    } catch (error) {

        next(handelError(401, 'not you data'))
    }



}

