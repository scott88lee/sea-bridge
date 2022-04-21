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

    saveMobileOrder: async (req, res) => {
        const zone = req.params.zone.toUpperCase();
        let body = req.body;
        console.log("Recieving " + zone + "mobile webhook.");

        // Ignore and move on if webhook already exists.
        let savedWebhook = await webhooks.archiveOrder(zone, body);

        if (savedWebhook) {
            console.log("Response send: 200 OK")
            res.send("[accepted]");
        } else {
            res.status(503)
            res.send(503)
        }
    },

    showMobileOrders: async (req, res) => {
        try {
            let result = await webhooks.getAppWebhooks();
            let data = result.rows;
            res.send(data);
        } catch (err){
            console.log("Error: ", err)
            res.send(false);
        }
    },

    testOrder: async (req, res) => {
        function findUnique(array) {
            let newSet = new Set(array);
            return [...newSet];
        }

        // const JUNO = require('../api/juno');
        // let _data = await JUNO.getSessionToken();
        // let jToken = _data.result.id;

        // function temp(){
        //     let data = []
        // for (let i = 0; i < result.rows.length; i++) {
        //     data.push(result.rows[i].raw_body)
        // }

        
        // console.log("Juno Session token: " + jToken);

        // let arr = []
        // let appOrders = [];
        // for (let i = 0; i < data.length; i++) {
        //     if (data[i].notificationItems.length > 0) {
        //         let item = data[i].notificationItems[0].NotificationRequestItem;
        //         if (item.eventCode == "AUTHORISATION") {
        //             console.log(item.success)
        //             if (item.success == "true") {
        //                 console.log("Success: " + JSON.stringify(item))
        //                 arr.push(item);
        //                 appOrders.push(Number(item.merchantReference.split("-")[0]))
        //             }
        //         }
        //     }
        // }

        // let unique = [...new Set(arr)];
        // console.log(unique);

        // let asd = await JUNO.getOrder(jToken, appOrders[0]);
        // console.log(asd);

        // paymentMethod = [ 'grabpay_SG', 'amex', 'visa', 'mc' ]

        // res.send(data)
        // }

        let { rows } = await webhooks.getAppWebhooks();
        console.log(rows)
        res.send('Ok')
    }
}