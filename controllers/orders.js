const db = require('../config/db')
const axios = require('axios')
const webhooks = require('../models/webhooks')

module.exports = {
   getall: (req, res) => {
      let str = "SELECT * FROM shopify_webhook_orders LIMIT 2;"
      db.query(str, (err, result) => {
         console.log(result)
         res.render("users/login")
      })
   },

   listArchive: async (req, res) => {
      let totalCount = await webhooks.getWebhookCount();
      let result = await webhooks.getWebhookRange(20,20);
      
      console.log(result[0])
      console.log(totalCount)
      for (let i=0; i<result.length; i++){
         //console.log(result[i].id)
         result[i].data = JSON.stringify(result[i].raw_data)
      }
      res.render('orders/archive', {orders:result});
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
