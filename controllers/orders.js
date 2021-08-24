const db = require('../config/db')

module.exports = {
   getall: (req, res) => {
      let str = "SELECT * FROM shopify_webhook_orders LIMIT 2;"
      db.query(str, (err, result) => {
         console.log(result)
         res.render("users/login")
      })
   },

   getArchive: (req, res) => {
      let str = "SELECT * FROM shopify_webhook_orders ORDER BY shopify_order_number DESC;"
      db.query(str, (err, result) => {
         console.log(result)
         res.render("orders/archive", {orders: result.rows})
      })
   },

   postWebhook: (req, res) => {
      console.log(req.body);
      res.send(true)
   }
}