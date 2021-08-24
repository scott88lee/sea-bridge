const db = require('../config/db')

module.exports = {
   archiveWebhook : async (jsonBody) => {
      let id = jsonBody.id;      
      let ordNum = jsonBody.order_number;      
      console.log("Ord ID: " + id)
      console.log("Ord Num: " + ordNum)
      let d = new Date();
      let timestamp = d.toUTCString();
      
      try {
         let result = await db.query('INSERT INTO shopify_webhook_orders(shopify_order_id, shopify_order_number, raw_data, created_at) VALUES($1, $2, $3, $4)', [id, ordNum, jsonBody, timestamp])
         return result;
      } catch (err) {
         console.log(err)
      }
   }
}