const db = require('../config/db')

module.exports = {
   archiveWebhook : (jsonBody) => {
      let content = typeof jsonBody == 'undefined' ? null : jsonBody;

      try {
         let query = "INSERT INTO shopify_webhook_orders (shopify_order_id, column2) VALUES (" + content.id + ", " + content + ");"
         db.query(query, (err, result) => {
            console.log(result);
            return result;
         });
      } catch (err) {
         console.log(err)
      }
   }
}