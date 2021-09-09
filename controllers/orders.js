const webhooks = require('../models/webhooks')
const orders = require('../models/orders')
const helper = require('../helpers/orders')
const JUNO = require('../api/juno');
const POS = require('../api/pos');
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
      try {
         let orderId = req.body.id;
         
         let webhook = await webhooks.getWebhookById(orderId);
         let URL = req.body.target;

         // API call
         let response = await axios.post(URL, webhook.raw_data)
         
         if (response.status == 200){ 
            res.send(true);
         }

      } catch (err) {
         if (err) {
            console.log(err);
            console.log("\n\n - Axios Post Error.")
            return false;
         }
      }
   },

   processOrder : async (req, res) => {
      let orderId = req.params.orderId;

      console.log("Start of order processing: " + orderId);

      //Cater for Idempotence
      let webhook = await webhooks.getWebhookById(orderId);

      if (webhook && !webhook.processed){ //Exist and not process yet
         console.log("Order: " + webhook.shopify_order_id + " - Processed: " + webhook.processed)
         let POStoken  = POS.getSessionToken();
         let Junotoken  = JUNO.getSessionToken();
         
         //Consolidate Membership, Frame and Lens into packages
         let itemsArray = helper.consolidateLineItems(webhook.raw_data.line_items);

         //Loop through line-items
         for (let i in itemsArray){
            if (itemsArray[i].sku == "128269"){
               POS.addMemberShip(POStoken, Junotoken, itemsArray[i].sku)
            } else {
               POS.getProductDetail(POStoken, itemsArray[i].sku)
            }
         }

         let saveOrder = await orders.saveOrder(webhook.raw_data);
      }
      
      //match lens to frame
      //
      //match lens to pos name
      //send package to cart.
      //register cart response.

      // send order to POS
      let jsn = axios.get("https://bridge.lenskart.com/api/sg-prescription/85888838");
      console.log(jsn);
   }
}
