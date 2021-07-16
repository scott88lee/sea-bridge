const express = require('express');
const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json())

const axios = require('axios')

const BASE_URL =  'https://apipos.lenskart.com/v1'
const AUTH_URL = BASE_URL + '/auth'
const API_URL = BASE_URL + '/prescription/customer?' // + customerPhone=83888838&phoneCode=%2B65

app.get('/getToken', async (req, res) => {
    
    let head = {
        "Content-Type" : "application/json",
        "X-Lenskart-API-Key" : "valyoo123",
        "X-Lenskart-App-Id" : "connect",
        "Cookie" : "lknewsite=true"
    }
    let body = {password:"LKpos@123",userName:"testlk1@valyoo.in"}
    let config = 
        {   
            method: "post",
            url: AUTH_URL,
            headers: head,
            data: body
        }
    
    try {
        //Getting session token from POS API
        let response = await axios(config)
        console.log("Success: " + response.data.sessionToken)

        //Getting prescription from POS API using session token
        if (response.status == 200) {
            //Include token into header
            head["X-Lenskart-Session-Token"] = response.data.sessionToken;

            // Set query string / URL
            let url = API_URL + "customerPhone=" + "92991231" + "&phoneCode=%2B65"
            
            // API call
            response = await axios.get(url, {headers:head})
            
            if (response.status == 200){
                let prescriptions = response.data.itemPrescriptions;
                res.send(prescriptions)
            } else {
                res.send("No prescription found");
            }
        }
    } 
    catch (err) {
        console.log(err)
        res.send(err)
    }
})

app.listen(8080, () => { console.log('Listening 443')})