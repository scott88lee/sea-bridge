const db = require('../config/db')

module.exports = {
   main: (req, res) => {
      res.redirect("/orders/archive")
   }
}