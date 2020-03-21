require('dotenv').config();
const knex = require('../db/knex');
const bcrypt = require('./custom-bcrypt');
const { validationResult  } = require('express-validator');

module.exports.get_register = (req, res) => {
    res.render('auth/register', {
        errors: ''
    });
};

module.exports.post_register = (req, res) => {
    const { name, email, address, password, confirmPassword } = req.body;
    //Check for Errors
    const errors = validationResult(req);

	if(!errors.isEmpty()) {
		return res.render('auth/register',{
			errors 			: 	errors.array(),
			name 			: 	name,
			email 			: 	email,
			password 		: 	password,
            confirmPassword : 	confirmPassword,
            adress          :   address 
		});
	} else {
		//CReating a MOdal for New User
        const newUser = {
            name: name,
            email: email,
            address: address,
            password: bcrypt.hash(password, {salt: process.env.salt, rounds: 20})
        };
        //Create New User
        knex("table_users").insert(newUser).then( (err) => {
            if (err) throw err;
        } );

        //Success Message
        req.flash('success','You are now registered and may log in');

        // res.location('/admin/auth/login');
        res.redirect('/admin/auth/login');
    }
};

module.exports.get_login = (req, res) => {
    if(req.flash('success').length === 0) {
        return res.render('auth/login', {
            errors: '',
            message: ''
        });
    }
    res.render('auth/login', {
        errors: '',
        message: req.flash('success')
    });
};

module.exports.post_login = (req, res) => {
   const { email, password} = req.body;
    //Check for Errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
		return res.render('auth/login',{
			errors : 	errors.array(),
			email 	: 	email,
            password : 	password,
            message: ''
		});
	} else {
        //Success Message
        req.flash('success','You are Logged In');
        req.session.userEmail = email;
        return res.redirect('/admin/dashboard');
    }

}

module.exports.get_logout = (req, res) => {
    delete req.session.userEmail;
    req.logout();
    req.flash('success','You have logged out');
    req.session.destroy(async function(err) {
        if (err) {
            return res.redirect('/admin/dashboard');
        }
        await res.clearCookie(process.env.SESS_NAME);
       return res.redirect('/admin/auth/login');
    });
};

module.exports.get_table = async (req, res) => {
    const users = await knex("table_users").select();
    res.render('table/users', {
        users: users,
        errors: ''
    });
}

module.exports.updateUser = (req, res) => {
    const { password, address } = req.body;
    const password2 = bcrypt.hash(password, {salt: process.env.salt, rounds: 20});
    knex("table_users")
    .update({
        password: password2,
        address: address
    })
    .where({id: req.params.id})
    .then(rows => {
        if (!rows){
            return res.status(404).json({success:false});
        }
        req.flash('success', 'update user success');
        return res.redirect('/admin/table');
    })
    .catch( e => res.status(500).json(e)); 
}

module.exports.deleteUser = async (req, res) => {
    await knex("table_users").where({id: req.params.id}).delete();
    return res.redirect('/admin/table');
}

module.exports.post_addUser = async (req, res) => {
    const users = await knex("table_users").select();
    const { name, email, address, password, confirmPassword } = req.body;
    //Check for Errors
    const errors = validationResult(req);

	if(!errors.isEmpty()) {
		return res.render('table/users',{
			errors 	: errors.array(),
			users: users
		});
	} else {
		//CReating a MOdal for New User
        const newUser = {
            name: name,
            email: email,
            address: address,
            password: bcrypt.hash(password, {salt: process.env.salt, rounds: 20})
        };
        //Create New User
        knex("table_users").insert(newUser).then( (err) => {
            if (err) throw err;
        } );

        //Success Message
        req.flash('success','Add user success');

        return res.redirect('/admin/table');
    }
}

module.exports.search_user = async (req,res) => {
    const user = await knex('table_users').select();
    const q = req.query.q;
    const matchedUsers = user.filter((user) => {
        return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    });
    return res.render('table/users', {
        users: matchedUsers,
        errors: ''
    });
}


