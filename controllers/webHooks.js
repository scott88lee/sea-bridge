const webhooks = require('../models/webhooks.js')

module.exports = {
    shopifyOrderCreate: async (req, res) => {

        let body = JSON.stringify(req.body)
        
        let result =  webhooks.archiveWebhook(body);
        res.send(result);

    }
}