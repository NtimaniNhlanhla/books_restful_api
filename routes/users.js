const express = require('express');
const { getUser, getUsers, createUser, updateUser, deleteUser} = require('../controllers/users');

const router = express.Router();

const User = require('../models/User');

const {  protect , authorize} = require('../middleware/auth')
const advancedResults = require('../middleware/advancedResults');  

router.use(protect);
router.use(authorize('admin'))

router.route('/').post(createUser).get(advancedResults(User), getUsers);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;