const { check } = require('express-validator');
const knex = require('./db/knex');
const bcrypt = require('./controller/custom-bcrypt');

module.exports.validateRegister = () => {
  return [ 
    // check('name', 'username must be Alphanumeric').isAlphanumeric(),
    // check( 'name','Name Field is Required').notEmpty(),
    // check( 'email','Email Field is Required').notEmpty(),
    // check('password','Password Field is Required').notEmpty(),
    // check( 'address','Address Field is Required').notEmpty(),
    check('name', 'username more than 3 degits').isLength({ min: 3 }),
    check('password', 'password more than 6 degits').isLength({ min: 6 }),
    check('email', 'email is invalid').isEmail(),
    check ('email').custom( async (value) => {
        await knex('table_users').where({ email: value}).select('email')
        .then( (result) => {
            if (result.length !== 0) {
                throw new Error('Email is already in use');
            } else {
                return true;
            }
        });
    }),
    check('password', 'password must be Alphanumeric').isAlphanumeric(),
    check('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        } else {
            return true;
        }
            
        })
  ];
}
module.exports.validateLogin = () => {
  return [ 
    // check('email', 'Invalid does not Empty').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    check('email').custom(async (value, { req}) => {
        await knex('table_users').where({ email: value}).select()
        .then( (result) => {
            if (result.length === 0) {
                throw new Error('Email is not exist');
            } else {
                return true;
            }
        });
    }),
    check('password', 'password more than 6 degits').isLength({ min: 6 }),
    check('password').custom(async (value, { req}) => {
        const user = await knex('table_users').select().where({email: req.body.email});
        if (!bcrypt.compare(value, user[0].password)) {
            throw new Error('Wrong password');
        } else {
            return true;
        }
    })
  ]; 
}
