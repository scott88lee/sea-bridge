const webhooks = require('../models/webhooks.js');

module.exports = {
    shopifyOrderCreate: async (req, res) => {

        let body = req.body;
        console.log("Recieving webhook: " + body.id);
        
        let exist = await webhooks.getWebhookById(body.id)
        if (exist) {
            console.log("Webhook already exist: 200 OK")
            res.send("200 OK");
        } else {
            let savedWebhook =  await webhooks.archiveWebhook(body);

            if (savedWebhook) {
                console.log("Init parallel order processing")
                let _ = axios.get('/orders/process/'+ body.id) // Asynchronous
                
                console.log("Response send: 200 OK")
                res.send("200 OK");
            } else {
                res.status(503)
                res.send(503)
            }
        }
    }
}