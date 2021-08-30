const axios = require('axios');

module.exports = {

   // Get session token from POS-API
   getSessionToken: async () => {
      console.log("Getting Juno Session token.");

      let head = {
         'Content-Type': 'application/json',
         'X-API-Client': 'desktop',
         'X-Country-Code': process.env.COUNTRY_CODE
      }

      let config = {
         method: "post",
         url: process.env.LK_SESSION_URL,
         headers: head
      }

      try {
         let response = await axios(config)
         console.log("LK session token: " + JSON.stringify(response.data.result.id))

         // let example = {
         //    "result": {
         //       "id": "7c53d4c2-66ad-402a-8a20-14d244dc7670",
         //       "attrs": { 
         //          "X-Country-Code": "SG", 
         //          "X-Api-Client": "desktop", 
         //          "User-Agent": "axios/0.21.1" 
         //       }
         //    }, "status": 200, "traceId": "72010720577ba155"
         // }

         return response.data
      }
      catch (err) {
         console.log("LK Session token error: " + err)
         return false;
      }
   }
}
