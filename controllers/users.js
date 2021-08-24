const db = require('../config/db')

module.exports = {
    main: (req, res) => {
        let str = "SELECT * FROM fruits;"
        db.query( str, (err, result) => {
            console.log(result)
            res.send("Welcome to SEA-Bridge")
        })
    }
}