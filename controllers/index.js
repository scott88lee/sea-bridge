const db = require('../config/db')

module.exports = {
    main: (req, res) => {
        res.redirect("/orders/archive")
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