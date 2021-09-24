const db = require('../config/db')

module.exports = {
    main: (req, res) => {
        let str = "SELECT * FROM fruits;"
        db.query( str, (err, result) => {
            console.log(result)
            res.redirect("/orders")
            //res.send("Welcome to SEA-Bridge")
        })
    },

    test: async (req, res) => {
        const juno = require('../api/juno');
        const pos = require('../api/pos');

        let payload = {};

        let token = await pos.getSessionToken();
        payload.pos = token
        payload.juno = await juno.getSessionToken();

        res.send(payload)
    }
}