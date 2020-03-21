
const knex = require('../db/knex');

module.exports.get_dash = (req, res) => {
    res.render('dashboard');
};

module.exports.profile = async (req, res) => {
    const users = await knex("table_users").select().where({email: req.session.userEmail});
    const user = users[0];
    res.render('userprofile', {
        user:user
    });
}

module.exports.viewUser = async (req, res) => {
    const users = await knex("table_users").select().where({id: req.params.id});
    const user = users[0];
    res.render('table/user_info/user', {
        user:user
    });
}