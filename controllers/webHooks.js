const webhooks = require('../models/webhooks.js');
const axios = require('axios');

module.exports = {
    shopifyOrderCreate: async (req, res) => {

        let body = req.body;
        console.log("Recieving webhook: " + JSON.stringify(body));
        
        let savedWebhook =  await webhooks.archiveWebhook(body);
        
        if (savedWebhook) {
            console.log("Before process")
            this.processOrder(body);
            console.log("After process")
            res.send("200 OK");
        }
    },

    processOrder : (JSONBody) => {
        console.log("Start of process")
        let jsn = axios.get("https://bridge.lenskart.com/api/sg/prescriptions/85888838");
        console.log(jsn);
    }
}