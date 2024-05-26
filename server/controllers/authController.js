import User from '../model/user.js'

import bcryptjs from "bcryptjs"
import { handelError } from '../utils/error.js';

import jwt from 'jsonwebtoken'

export const register = async (req, res, next) => {


    console.log(req.body);

    const { firstname, lastname, email, password, phone, username } = req.body

    const hashedPassword = bcryptjs.hashSync(password, 10)

    const newUser = new User({ firstname, lastname, email, password: hashedPassword, phone, username })

    try {
        await newUser.save()
        res.status(201).json('user created successfully ')

    } catch (error) {

        next(error)
        // next(handelError())

    }
}

export const login = async (req, res, next) => {

    // destructure the email and password from the rest of the data

    const { email, password } = req.body

    try {
        //check the email

        const existingUser = await User.findOne({ email })
        if (!existingUser) return next(handelError(404, 'user not found'))

        //check the hashed pasword using bcryptjs method called compareSync

        const existingPassword = bcryptjs.compareSync(password, existingUser.password)

        if (!existingPassword) return next(handelError(404, 'wrong password'))

        //create a jwt token

        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET)

        const { password: pass, ...restOfTheData } = existingUser._doc

        //save jwt token as cookie and its a session

        res.cookie('access_token', token, { httpOnly: true, })
            .status(200)
            .json(restOfTheData)


    } catch (error) {
        next(error)

    }
}

export const google = async (req, res, next) => {

    try {
        const user = await User.findOne({ email: req.body.email })

        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            const { password: pass, ...restOfTheData } = user._doc

            res.cookie('access_token', token, { httpOnly: true, })
                .status(200)
                .json(restOfTheData)
        } else {

            // random generated password and phonenumber because when user sign-in .  the google provider dosn't provide users password or phonenumber so its random generated (in user model the password and phonenumber is required ) whith out pass or phone the user cannot sign-in with google


            const generatedPass = Math.random.toString(36).slice(-8) + Math.random.toString(36).slice(-8)
            const hashedPassword = bcryptjs.hashSync(generatedPass, 10)
            const newUser = new User({ username: req.body.name.split(" ").join('').toLowerCase() + Math.random.toString(36).slice(-4), email: req.body.email, password: hashedPassword, avatar: req.body.photo })

            await newUser.save()

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)

            const { password: pass, ...restOfTheData } = newUser._doc


            res.cookie('access_token', token, { httpOnly: true, })
                .status(200)
                .json(restOfTheData)

        }

    } catch (error) {
        next(error)

    }
}

export const logout = async (req, res, next) => {
    try {
        res.clearCookie('access_token')
        res.status(200).json('user logged out')

    } catch (error) {
        next(error)

    }
}