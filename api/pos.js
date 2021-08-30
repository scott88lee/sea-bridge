const axios = require('axios');

module.exports = {

  // Get session token from POS-API
  getSessionToken: async () => {
    console.log("Getting POS session token.");

    let head = {
      "Content-Type": "application/json",
      "X-Lenskart-API-Key": process.env.LENSKART_API_KEY,
      "X-Lenskart-App-Id": process.env.LENSKART_APP_ID
    }

    let body = {
      "isEncodingRequired": false,
      userName: process.env.POSAUTH_USERNAME,
      password: process.env.POSAUTH_PASSWORD
    }

    let config = {
      method: "post",
      url: process.env.POSAPI_URL + "/auth",
      headers: head,
      data: body
    }

    try {
      let response = await axios(config)
      console.log("POS session token: " + response.data.sessionToken);

      //next feature, cache the token.
      return response.data
    }
    catch (err) {
      console.log("Error: " + err)
      return false;
    }
  }
}
