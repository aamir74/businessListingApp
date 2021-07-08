const express = require('express')
const businessesControllers = require('../controllers/businesses-controllers')
const { check } = require('express-validator')
const checkAuth = require('../middleware/check-auth')
const router = express.Router()

router.get('/:bid', businessesControllers.getBusinessesByVendorId)

router.get('/', businessesControllers.getBusinesses)

router.use(checkAuth)

router.post(
    '/add',
    [
        check('category').not().isEmpty(),
    ]
    , businessesControllers.createBusinessListing
)

module.exports = router