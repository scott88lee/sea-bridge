const axios = require('axios');

module.exports = {

   // Get session token from POS-API
   getSessionToken: async () => {
      console.log("Getting Juno Session token.");

      let options = { headers : {
         'Content-Type': 'application/json',
         'X-API-Client': 'desktop',
         'X-Auth-Token': '8e8b0816-4c73-4f08-8f7d-022dcd186a91',
         'X-Country-Code': process.env.COUNTRY_CODE
        }
      }

      let URL = process.env.JUNOAPI_URL + "/v2/sessions"

      try {
         let response = await axios.post(URL, options)
         //console.log("LK session token: " + JSON.stringify(response.data.result.id))
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
         console.log("Trace: api>juno>getSessionToken")
         throw err;
      }
   },

   getOrder: async (token, orderId) => {
      try {
         let options = { 
            headers : {
               'Content-Type': 'application/json',
               'X-API-Client': 'desktop',
               'X-Auth-Token': '8e8b0816-4c73-4f08-8f7d-022dcd186a91',
               'X-Country-Code': process.env.COUNTRY_CODE,
               'X-Session-Token': token
            }
         }
      
         let URL = process.env.JUNOAPI_URL + "/v2/orders/" + orderId
         console.log("Juno URL: " + URL)

         let { data } = await axios.get(URL, options)
         return data;
      } catch (err) {
         console.log("Trace: api>juno>getOrder")
         throw err;
      }
   }
}
