const db = require('../config/db')
const fs = require('fs')

module.exports = {
    shopifyOrderCreate: async (req, res) => {
        console.log(req.body)

        let body = JSON.stringify(req.body) + "\n";

        fs.appendFile("../orders.txt", body, (err) => {
            if (err) {
              console.log(err);   
            }
            else {
                res.sendStatus(200)
            }
        });
    }
}