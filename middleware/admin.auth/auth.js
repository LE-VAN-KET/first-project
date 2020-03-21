
module.exports.requirelogin = (req, res, next) => {
  // if (!req.signedCookies.userId) {
  //     res.redirect('/auth/login');
  //     return;
  // }
  if (!req.session.userEmail) {
    res.redirect('/admin/auth/login');
  } 
  next();
  // var user = db.get('users').find({ id: req.signedCookies.userId }).value();
  // if (!user) {
  //   res.redirect('/auth/login');
  //   return;
  // }
  
  // res.locals.user = user;
  // next();
}

module.exports.user_auth = (req, res, next) => {
  if (typeof req.session.userEmail !== 'undefined') {
    return res.redirect('/admin/dashboard');
  }
  next();
}
