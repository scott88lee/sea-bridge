const db = require('../config/db')

module.exports = {
  renderNew: (req, res) => {
   res.render("packages/new")
  }
}