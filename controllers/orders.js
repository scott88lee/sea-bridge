const db = require('../config/db')

module.exports = {
   getall: (req, res) => {
      let str = "SELECT * FROM shopify_webhook_orders LIMIT 2;"
      db.query(str, (err, result) => {
         console.log(result)
         res.render("users/login")
      })
   }
}