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
        let response = await axios(config)
        console.log("Success: " + response.data.sessionToken)
        if (response.data.sessionToken) {
            head["X-Lenskart-Session-Token"] = response.data.sessionToken;
            let url = API_URL + "customerPhone=" + "92991231" + "&phoneCode=%2B65"
            let prescriptions = await axios.get(url, {headers:head})
            console.log(prescriptions.data)
            if (prescriptions.data){
                res.send(prescriptions.data)
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

app.listen(8080, () => { console.log('Listening 8080')})