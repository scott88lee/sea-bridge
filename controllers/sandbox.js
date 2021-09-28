const db = require('../config/db')

//Controllers
module.exports = {
   index: (req, res) => {
      res.render("sandbox/new")
   },
}