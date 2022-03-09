const webhooks = require('../models/webhooks.js');
const axios = require('axios');

module.exports = {
    shopifyOrderCreate: async (req, res) => {
        const zone = req.params.zone.toUpperCase();
        let body = req.body;
        console.log("Recieving " + zone + "webhook: " + body.id);

        // Ignore and move on if webhook already exists.
        let exist = await webhooks.getWebhookById(zone, body.id)
        if (exist) {
            console.log("Webhook already exist: 200 OK")
            res.send("200 OK");
        } else {
            //If webhook doesnt exist, proceed to save it to DB
            let savedWebhook = await webhooks.archiveWebhook(zone, body);

            if (savedWebhook) {
                console.log("Init parallel order processing")
                let _ = axios.get('/orders/process/' + body.id) // Asynchronous

                console.log("Response send: 200 OK")
                res.send("200 OK");
            } else {
                res.status(503)
                res.send(503)
            }
        }
    },

    getWebhookByOrderNumber: async (req, res) => {
        // Multiple zone handling
        const zone = req.params.zone.toUpperCase();
        const orderNumber = req.params.orderNumber;

        try {
            let record = await webhooks.getBy(zone, orderNumber);

            if (record) {
                res.send(record);
            }

        } catch (err) {
            console.log("Error: ", err)
            res.send(false);
        }
    },

    saveMobileOrders: async (req, res) => {
        // Multiple zone handling
        res.send('OK')
    }
}