const db = require('../config/db')

module.exports = {
   archiveWebhook : async (jsonBody) => {
      let id = jsonBody.id;      
      console.log(id)
      let d = new Date();
      let dat = d.toUTCString();


      try {
         let result = await db.query('INSERT INTO shopify_webhook_orders(shopify_order_id, raw_data, created_at) VALUES($1, $2, $3)', [id, jsonBody, dat])
         return result;
      } catch (err) {
         console.log(err)
      }
   }
}