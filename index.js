//===================================================DEPENDENCIES DECLARATION=====================================================

'use strict';
let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let https= require('https');
var port = process.env.PORT || 3000;
var Alexa = require('alexa-sdk');
var sessionHandlers=require('./src/alexa.js');
var request=require('request');
var symptom = "";
var age= "";
var sex="";
var id="";
var sy="";
//dependencies.
//=======================================HANDLER FUNCTION FOR AWS LAMBDA FOR CHANNEL DETECTION=====================================
//handler function for AWS Lambda
exports.handler = function(event, context, callback){

  console.log("1"+JSON.stringify(event));
  console.log("1"+JSON.stringify(context));

  if(event.hasOwnProperty('session')) //session from Alexa Request JSON
  {
    console.log("RequestFromAlexaSkillKit");
    //Trigger Alexa Function
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers); //handlers contain alexa-sdk function based intent logic
    alexa.execute();
  }//FOR ALEXA SKILL

  else if(event.hasOwnProperty('result'))//session from APIAI Webhook Request JSON
  {
    console.log("RequestFromAPI.AI");
    //Prepare API.AI Response
    //symptom = originalRequest.context.symp;
    console.log(event.originalRequest.data.message.text);
    symptom = event.originalRequest.data.message.text;
    age=event.result.contexts[0].parameters.age;
    sex=event.result.contexts[0].parameters.sex;
    console.log("symptom:",symptom);
    console.log("age:",age);
    console.log("sex:",sex);
    console.log("id:",id);
    calldoc(function(data){
      console.log(data);
      id=data.mentions[0].id;
      console.log("Data : " + data.mentions[0].name);
      console.log(id,data.mentions[0].name);
      nextQuestion();
      //sym=data.mentions[0].name;
      //context.succeed(response);
    });
  }//FOR API.AI CONTEXTS
else
  {
      console.log("Unknown Source");
  }//FOR UNKNOWN SOURCES
};
//===============================================ALEXA SKILL INTENT CONTAINER================================================
//ALEXA SKILLS CONTAINER
//var handlers contain all alexa intents sdk style.
var handlers = sessionHandlers;
//=================================================API.AI CONTEXTS CONTAINER=================================================

function calldoc(callback){
  console.log("Inside Calldoc");
  var headers = {
      'Content-Type': 'application/json',
      'Accept' : 'application/json',
      'app-id' : '08d386be',
      'app-key': 'cfd774b10588cd534570a051d1157800'
  }
  var options = {
    port: 80,
    json: true,
    url: 'https://api.infermedica.com/v2/parse',
    method: 'POST',
    headers: headers
  }
  var requ = request(options,function(error, response, body) {
    console.log("StatusCode : " + response.statusCode);
    callback(body);
    console.log("Inside calldoc data");
    console.log(body);
  });
  requ.on('error', function(e) {
      console.log('Problem with request: ' + e.message);
  });
  var body = JSON.stringify({"text": symptom, "include_tokens": false})
  console.log('Body requested --------: ' + body);
  requ.write(body);
  //requ.end();
}

function nextQuestion(callback){
  console.log("Inside nextQuestion");
  var options ={
      method:'POST',
      url:'https://api.infermedica.com/v2/diagnosis',
      headers:
      {
        'Content-Type':' application/json',
        'Accept':'application/json',
        'App-Id':'08d386be',
        'app-key':'cfd774b10588cd534570a051d1157800',
        'Dev-Mode': true
      },
      body:
      {
        "sex":sex,
        "age":age,
        "evidence":[
          {
          "id":id,
          "choice_id":"present"
        }
      ]
    },
    json :true
};
request(options, function (error, response, body) {
  if (error) throw new Error(error);
  console.log(body);
});
}

// var response={
//                 "speech": sym,
//                 "displayText": "sym",
//                 "data": {},
//                 "contextOut": [],
//                 "source": "DuckDuckGo"
//               };
//==============================================SERVER HOSTING CODE BLOCK====================================================
if (module === require.main) {
  // [START server]
  // Start the server
  let server = app.listen(process.env.PORT || 8080, function () {
    let port = server.address().port;
    console.log('App listening on port %s', port);
  });
  // [END server]
}
