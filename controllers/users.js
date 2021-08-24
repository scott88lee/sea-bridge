const db = require('../config/db')

module.exports = {
    renderLogin: (req, res) => {
        let str = "SELECT * FROM fruits;"
        db.query( str, (err, result) => {
            console.log(result)
            res.render("users/login")
        })
    },

    authUser: (req, res) => {
        let u = req.body;
        
        if (u.username == 'admin' && u.password == 'qweqwe') {
          req.session.loggedIn = true;
          
          req.session.save(function (err) { //Forces session data to save
            if (err) return next(err)
            res.redirect('/sales')
          })
        } else {
          res.render('root/login', {message: "Invalid name / password"})
        }
      },
    
      logOut: (req, res) => {
        req.session.loggedIn = false;
        res.redirect('/login')
      }
}