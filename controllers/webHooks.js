const webhooks = require('../models/webhooks.js')

module.exports = {
    shopifyOrderCreate: async (req, res) => {

        let body = req.body;
        console.log(body);
        
        let result =  await webhooks.archiveWebhook(body);
        res.send(result);
    }
}