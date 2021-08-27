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
         let result = await db.query('INSERT INTO shopify_webhook_orders(shopify_order_id, shopify_order_number, raw_data, created_at, processed) VALUES($1, $2, $3, $4, $5)', [id, ordNum, jsonBody, timestamp, false])
         console.log('Webhook archived at: ' + timestamp)
         return result;
      } catch (err) {
         console.log("Error archiving webhook: " + err)
         return false;
      }
   },
   
   getWebhookCount: async () => {
      try {
      let result = await db.query("SELECT COUNT(shopify_order_number) FROM shopify_webhook_orders;");
         if (result.rowCount > 0){
            return result.rows[0];
         }
      } catch (err) {
         console.log(err)
         return false;
      }
   },
   
   getWebhookRange: async (limit, offset) => {
      try {
         let str = "SELECT * FROM shopify_webhook_orders ORDER BY shopify_order_number DESC LIMIT "+ limit + "OFFSET " + offset + ";"      
         let result = await db.query(str);
         
         if (result.rowCount > 0){
            return result.rows;
         }
      } catch (err) {
         console.log(err)
         return false;
      }
   }
}