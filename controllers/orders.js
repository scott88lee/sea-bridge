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
      //For Pagination
      let totalCount = await webhooks.getWebhookCount();
      let nav = {
         pageNumber: 1,
         backButton: false,
         pageArray: [],
         range: 10,
         pageCount: 0
      }

      if (req.query.page){
         nav.pageNumber = req.query.page;
         nav.backButton = true;
      }

      let limit = 10;
      let offset = limit * (nav.pageNumber-1);
      nav.pageCount = Math.floor(totalCount.count / limit);

      if (nav.pageNumber > 5){
         for (let i=nav.pageNumber-4; i<nav.pageNumber+5; i++){
            nav.pageArray.push(i);
         }
      } else {
         nav.pageArray = [1,2,3,4,5,6,7,8,9];
      }
      console.log(nav)
      //For pagination

      let result = await webhooks.getWebhookRange(limit, offset);
      
      if (result){
         for (let i=0; i<result.length; i++){
            result[i].data = JSON.stringify(result[i].raw_data)
         }

         console.log(result)
         res.render('orders/archive', {
            orders:result,
            navigation:nav
         });
      } else {
         res.send("No orders found")
      }
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
