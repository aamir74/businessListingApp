const Vendor = require('../models/vendor.js')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');


const signup = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error = res.status(422).json({ error: 'Signing up failed, Plz try again later..' })
        return next(error)
    }

    const { name, email, password } = req.body

    let existingVendor
    try {
        existingVendor = await Vendor.findOne({ email: email })
    } catch (err) {
        const error = res.status(500).json({ error: 'Signing up failed, Plz try again later..' })
        return next(error)
    }

    if (existingVendor) {
        const error = res.status(422).json({ error: 'User already exists, Login instead' })
        return next(error)
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 14)
    } catch (err) {
        const error = res.status(500).json({ error: 'Could not create User,Please Try again later' })
        return next(error)
    }


    const createdVendor = new Vendor({
        name,
        email,
        password: hashedPassword,
        pan_no: "pan",
        businesses: []
    })
    try {
        await createdVendor.save()
    } catch (err) {
        console.log(err)
        const error = res.status(500).json({ error: 'Signing up failed, Please try again' })
        return next(error)
    }

    let token;
    try {
        token = jwt.sign({ vendorId: createdVendor.id, email: createdVendor.email },
            'parenting',
            { expiresIn: '2h' }
        )
    } catch (err) {
        const error = res.status(500).json({ error: 'Signing up failed, Please try again' })
        return next(error)
    }

    res.status(201).json({ vendorId: createdVendor.id, email: createdVendor.email, token: token })

}

const login = async (req, res, next) => {

    const { email, password } = req.body

    let existingUser;

    try {
        existingVendor = await Vendor.findOne({ email: email })
    } catch (err) {
        const error = res.status(500).json({ error: 'Logging In failed, Plz try again later..' })
        return next(error)
    }

    if (!existingVendor) {
        const error = res.status(403).json({ error: 'Invalid Credentials, Could not Log you in' })
        return next(error)
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingVendor.password)
    } catch (err) {
        const error = res.status(500).json({ error: 'Could not Log you in , Check Credentials and try again later' })
        return next(error)
    }

    if (!isValidPassword) {
        const error = res.status(401).json({ error: 'Invalid Credentials, Could not Log you in' })
        return next(error)
    }

    let token;
    try {
        token = jwt.sign({ VendorId: existingVendor.id, email: existingVendor.email },
            'parenting',
            { expiresIn: '2h' }
        )
    } catch (err) {
        const error = res.status(500).json({ error: 'LoggingIn failed, Please try again' })
        return next(error)
    }

    res.json({ vendorId: existingVendor.id, email: existingVendor.email, token: token })
}

const addPan = async (req, res, next) => {
    const { pan_no } = req.body
    const vendorId = req.params.vid
    let vendor
    try {
        vendor = await Vendor.findById(vendorId);
    } catch (err) {
        const error = res.status(500).json({ error: "Something went wrong, Couldn't Place Order" })
        return next(error)
    }

    if (!vendor) {
        const error = res.status(404).json({ error: "Could not find the product" })
        return next(error);
    }

    try {
        vendor.pan_no = pan_no
        await vendor.save();

    } catch (err) {
        const error = res.status(500).json({ error: "Something went wrong, can't add to the Orders" })
        return next(error)
    }
    res.status(201).json({ vendor: vendor.toObject({ getters: true }) })
}

exports.signup = signup
exports.login = login
exports.addPan = addPan
