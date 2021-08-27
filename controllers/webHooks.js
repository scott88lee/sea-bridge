const webhooks = require('../models/webhooks.js');
const orders = require('../controllers/orders.js');

module.exports = {
    shopifyOrderCreate: async (req, res) => {

        let body = req.body;
        console.log("Recieving webhook: " + JSON.stringify(body));
        
        let savedWebhook =  await webhooks.archiveWebhook(body);
        
        if (savedWebhook) {
            console.log("Before process")
            orders.processOrder(body);
            console.log("After process")
            res.send("200 OK");
        }
    }
}