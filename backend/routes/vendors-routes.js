const express = require ('express')

const vendorsControllers = require ('../controllers/vendors-controllers')

const router = express.Router()

router.post('/signup',vendorsControllers.signup)
router.post('/login',vendorsControllers.login)
router.post('/addPan/:vid',vendorsControllers.addPan)




module.exports = router