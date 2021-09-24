const db = require('../config/db')

module.exports = {
   index: (req, res) => {
      res.render("packages/new")
   }
}