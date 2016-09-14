'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const facebook = require('./facebook.js');

const app = express();

// parse out json body
app.use(bodyParser.json());

// app.get('/', function (req, res) {
//   res.send('It works this far!');
// });

app.post('/*', function(req, res) {
  console.log('gh-company-info-webhook entered');
  var speech = '';
  var displayText = '';
  var data = '';
  var body = req.body || {};
  var result = body.result || {};
  var params = result.parameters || {};
  var action = result.action;
  var companyName = params.company_name;
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

  displayText = "We found the contact info for " + companyName + ":\nContact Name: " + contactName +",\nPhone number: " + phone + ",\nAddress: " + address;
  speech = "We found the contact info for " + companyName + ", and have printed it to your screen.";

  return res.json({
      speech: speech,
      displayText: displayText,
      data: data,
      source: 'gh-company-info-webhook'
  });
});

var port = (process.env.PORT || 5000);

app.listen(port, function() {
    console.log("Server listening on port: " + port);
});