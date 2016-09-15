'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const facebook = require('./facebook.js');

const app = express();

// parse out json body
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('This is a server to handle Webhook requests from API.ai');
});

app.post('/*', function(req, res) {
  console.log('gh-company-info-webhook entered');
  var speech = '';
  var displayText = '';
  var data = '';
  var body = req.body || {};
  var result = body.result || {};
  var params = result.parameters || {};
  var action = result.action || '';
  var contextIn = result.contexts.name || '';
  // defaults to sending the same Context out as what it received In
  //  is this necessary? this may happen automatically via api.ai
  var contextOut = result.contexts || [];
  // var resetContexts = false;

  var companyName = params.company_name || '';
  var phone = '';
  var address = '';
  var contactName = '';

  if (body) {
    console.log('body is ' + JSON.stringify(body));
  }
  else {
    console.log('no body');
    return res.json({ error: true });
  }

  if (action == "companyInfo") {
    switch(companyName) {
      case "Sprint":
          phone = facebook.Sprint.phone;
          address = facebook.Sprint.phone;
          contactName = facebook.Sprint.contactName;
          break;
      case "Verizon":
          phone = facebook.Verizon.phone;
          address = facebook.Verizon.phone;
          contactName = facebook.Verizon.contactName;
          break;
      case "AT&T":
          phone = facebook.ATT.phone;
          address = facebook.ATT.phone;
          contactName = facebook.ATT.contactName;
          break;
      default:
          phone = "phone fail";
          address = "address fail";
          contactName = "contact name fail";
    };
    displayText = "We found the contact info for " + companyName + ": Contact Name: " + contactName +"; Phone number: " + phone + "; Address: " + address + ". Was this the information you were looking for?";
    speech = displayText;
    contextOut = [
      {
        "name": "has-information",
        "parameters": {
          // "company_name.original": "att",
          "company_name": companyName
        },
        // how many minutes the context will remain
        "lifespan": 5
      }
    ];
  }
  else if (action == "sendFeedback") {
    var satisfied = result.contexts.parameters.satisfied || '';
    if (satisfied == "Yes") {
      displayText = "We're so happy we could help!";
      speech = displayText;
      // keep the has-information context
      // (no need to change it, maybe?)
      // contextOut = _____;
    } else {
      displayText = "We're sorry we could not help. Could you tell us again which company you are trying to get in touch with?";
      speech = displayText;
      // want to clear the 'has-information' context - HOW???
      contextOut = [];
    }
  };

  return res.json({
      speech: speech,
      displayText: displayText,
      data: data,
      contextOut: contextOut,
      // ? How do we reset the Context?
      //    below does not seem to work ...
      // resetContexts: resetContexts,
      source: 'gh-company-info-webhook'
  });
});

var port = (process.env.PORT || 5000);

app.listen(port, function() {
    console.log("Server listening on port: " + port);
});