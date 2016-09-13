//raw code form another repo - needs repurposing

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const facebook = require('./facebook.js');

const app = express();

app.use(bodyParser.json());

app.post('/webhook', function(req, res) {
    console.log('gh-company-info-webhook entered');
    try {
        var speech = '';
        var displayText = '';
        var data = '';
        if (req.body) {
            var requestBody = req.body;
            if (requestBody.result) {
                if (requestBody.result.fulfillment) {
                    speech = (requestBody.result.fulfillment.speech || speech);
                    displayText = (requestBody.result.fulfillment.displayText || displayText);
                }
                if (requestBody.result.action) {
                    var action = requestBody.result.action;
                    var messageData = '';
                    // adjusted code here
                    if (action == "companyInfo") {
                      messageData = facebook.companyInfo();
                      data = { 'facebook': messageData };
                    }
                    // if (action == "showOffers") {
                    //   messageData = facebook.showOffers();
                    //   data = { 'facebook': messageData };
                    // } else if (action == "addToCart") {
                    //   //TODO add the product to user's shopping cart in database
                    //   messageData = facebook.addedToCart();
                    //   data = { 'facebook': messageData };
                    // } else if (action == "showCart") {
                    //   //TODO read shopping cart items from database
                    //   messageData = facebook.showCart();
                    //   data = { 'facebook': messageData };
                    // } else if (action == "buyCart") {
                    //   //TODO create order
                    //   messageData = facebook.showReceipt();
                    //   data = { 'facebook': messageData };
                    // } else if (action == "resetCart") {
                    //   //TODO drop user's shopping cart from database
                    //   speech = 'Your shopping cart is empty again.';
                    //   displayText = 'Your shopping cart is empty again.';
                    // }
                }
            }
        }
        //console.log('speech: ', speech);
        //console.log('displayText: ', displayText);
        //console.log('data: ', JSON.stringify(data));
        return res.json({
            speech: speech,
            displayText: displayText,
            data: data,
            source: 'retail-bot-webhook'
        });
    } catch (err) {
        console.error("Can't process request", err);
        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});

app.listen((process.env.PORT || 5000), function() {
    console.log("Server listening");
});