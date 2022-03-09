const db = require('../config/db')

module.exports = {
   archiveWebhook : async (zone, jsonBody) => {
      let id = jsonBody.id;      
      let ordNum = jsonBody.order_number;      
      console.log("Ord ID: " + id)
      console.log("Ord Num: " + ordNum)
      let d = new Date();
      let timestamp = d.toUTCString();
      
      try {
         let result = await db.query('INSERT INTO shopify_webhook_orders(shopify_order_id, shopify_order_number, raw_data, created_at, processed, zone) VALUES($1, $2, $3, $4, $5, $6)', [id, ordNum, jsonBody, timestamp, false, zone])
         console.log('Webhook archived at: ' + timestamp)
         return result;
      } catch (err) {
         console.log("Error archiving webhook: " + err)
         return false;
      }
   },

   archiveOrder : async (zone, jsonBody) => {
      let d = new Date();
      let timestamp = d.toUTCString();
      
      try {
         let result = await db.query('INSERT INTO mobile_webhook_orders(raw_data, created_at, zone) VALUES($1, $2, $3)', [jsonBody, timestamp, zone])
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
   },

   getWebhookById: async (zone, orderId) => {
      try {
         let str = "SELECT * FROM shopify_webhook_orders WHERE shopify_order_id=" + orderId + " AND zone= '" + zone + "';"
         let result = await db.query(str);
         
         if (result.rowCount > 0 ) {
            return result.rows[0];
         } else {
            return false;
         }
      } catch (err){
         console.log("Function name: getWebhookById")
         console.log(err)
         return false;
      }
   },

   getWebhookByOrderNumber: async (orderNum) => {
      try {
         let str = "SELECT * FROM shopify_webhook_orders WHERE shopify_order_number=" + orderNum + ";"
         let result = await db.query(str);
         
         if (result.rowCount > 0 ) {
            return result.rows[0];
         } else {
            return false;
         }
      } catch (err){
         console.log("Function name: getWebhookByOrderNum")
         console.log(err)
         return false;
      }
   },

   setWebhookProcessed: async (orderId) => {
      try {
         let d = new Date();
         let timestamp = d.toUTCString()

         let str = "UPDATE shopify_webhook_orders SET processed=true, processed_at=" + timestamp + " WHERE shopify_order_id =" + orderId + ";"
         let success = await db.query(str);
         if (success) {
            return success
         } else {
            return false;
         }
      } catch (err){
         console.log("Function name: setWebhookProcessed")
         console.log(err)
         return false;
      }
   },

   getBy: async (zone, orderNum) => {
      let query = "SELECT * FROM shopify_webhook_orders WHERE zone='" + zone + "' AND shopify_order_number=" + orderNum + ";"
      try {
         let result = await db.query(query);
         //console.log(result)

         if (result.rows.length > 0) {
            return result.rows[0].raw_data;
         } else {
            return false;
         }
      } catch (err) {
         console.log(query);
         console.log("Error: ", err);
         return false;
      }
   }
}