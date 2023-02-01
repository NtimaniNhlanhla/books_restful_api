const express = require('express');
const { register, login, getMe,
        forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword,
   logout} = require('../controllers/auth');

const router = express.Router();

const {  protect } = require('../middleware/auth')

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/me').get(protect,getMe);
router.route('/logout').get(protect,logout);
router.route('/updateDetails').get(protect,updateDetails);
router.route('/updatePassword').put(protect,updatePassword);
router.route('/forgotPassword').post(forgotPassword);
router.route('/resetPassword/:resettoken').put(resetPassword);

module.exports = router;