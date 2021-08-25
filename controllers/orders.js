const db = require('../config/db')
const axios = require('axios')

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

   postWebhook: async (req, res) => {
      console.log(req.body);
      let str = "SELECT * FROM shopify_webhook_orders WHERE shopify_order_id =" + req.body.id + ";"

      db.query(str, async (err, result) => {
         let webhook = result.rows[0].raw_data;
         let URL = req.body.target;

      try {
         // API call
         let response = await axios.post(URL, webhook)
         
         if (response.status == 200){ 
            
            let str = "UPDATE shopify_webhook_order SET processed=true WHERE shopify_order_id =" + req.body.id + ";"
            db.query(str, async (err, result) => {
               if (result) {
                  console.log('Post Webhook: Success!')
                  res.send(true);
               }
            })
         }
      } catch (err) {
         if (err) {
            console.log(err);
            console.log("\n\n - Axios Post Error.")
            return false;
         }
      }
         res.send("OK")
      })
   }
}
