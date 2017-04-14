var request= require('request');
module.exports={
calldoc:function(callback,symptom){
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
  var requ = request(options, function(error, response, body) {
    console.log("StatusCode : " + response.statusCode);
    callback(body);
    console.log("Exiting calldoc defination");
  });
  requ.on('error', function(e) {
      console.log('Problem with request: ' + e.message);
  });
  var body = JSON.stringify({"text": symptom, "include_tokens": false})
  //console.log('Body requested --------: ' + body);

  requ.end();
}
};
