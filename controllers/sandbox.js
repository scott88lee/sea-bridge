const db = require('../config/db')

module.exports = {
   index: (req, res) => {
      res.render("packages/new")
   },

   upload: (req, res) => {
      console.log(req.body)
      console.log(req)
      res.send(req)
   }
}