const express = require('express');
const router = express.Router();

const { validateRegister, validateLogin } = require('../validate');

const { get_register, 
    post_register,
    get_login,
    post_login,
    get_logout,
    get_table,
    updateUser,
    deleteUser,
    post_addUser,
    search_user } = require('../controller/auth.controller');

const { get_dash,
    profile,
    viewUser } = require('../controller/dash.controller');

const { requirelogin,
    user_auth } = require('../middleware/admin.auth/auth');

router.get('/', user_auth, (req, res) => {
    res.render('home');
  });

  //register
router.route('/auth/register')
.get(user_auth, get_register)
.post(user_auth, validateRegister() , post_register)

    //login
router.route('/auth/login')
.get(user_auth, get_login )
.post(user_auth, validateLogin() , post_login)

    //logout
router.get('/auth/logout', requirelogin, get_logout);

router.get('/dashboard',requirelogin, get_dash);

router.get('/userprofile',requirelogin, profile);

//show all info user
router.route('/table')
.get(requirelogin, get_table)
.post(requirelogin, validateRegister(), post_addUser);

router.get('/table/search', search_user);

//delete and update profile user
router.route('/table/user/:id')
.put(requirelogin, updateUser)
.delete(requirelogin, deleteUser)

//view user profile
router.get('/user/:id',requirelogin, viewUser);

module.exports = router;