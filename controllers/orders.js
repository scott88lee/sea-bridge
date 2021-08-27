const webhooks = require('../models/webhooks')
const db = require('../config/db')
const axios = require('axios')

module.exports = {
   listArchive: async (req, res) => {
      //For Pagination
      let totalCount = await webhooks.getWebhookCount();
      let nav = {
         pageNumber: 1,
         backButton: 1,
         forwardButton: 2,
         pageArray: [],
         range: 10,
         pageCount: 0
      }

      if (req.query.page){
         let page = Number(req.query.page);
         nav.pageNumber = page > 1 ? page : 1 ;
         nav.forwardButton = page > 1 ? page+1 : 2 ;
         nav.backButton = page > 1 ? page-1 : 1 ;
      }

      let limit = 10;
      let offset = limit * (nav.pageNumber-1);
      nav.pageCount = Math.floor(totalCount.count / limit);

      if (nav.pageCount == nav.pageNumber) {
         nav.forwardButton = false;
      }

      if (nav.pageNumber > 5){
         for (let i=nav.pageNumber-4; i<nav.pageNumber+5; i++){
            if (i <= nav.pageCount) {
               nav.pageArray.push(i);
            }
         }
      } else {
         nav.pageArray = [1,2,3,4,5,6,7,8,9];
      }
      
      //For pagination debuging
      //console.log(nav)

      let result = await webhooks.getWebhookRange(limit, offset);
      
      if (result){
         for (let i=0; i<result.length; i++){
            result[i].data = JSON.stringify(result[i].raw_data)
         }

         //console.log(result)
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
   },

   processOrder : (JSONBody) => {
      console.log("Start of process")
      let jsn = axios.get("https://bridge.lenskart.com/api/sg-prescription/85888838");
      console.log(jsn);
   }
}
