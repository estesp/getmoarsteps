
var env = JSON.parse(process.env.VCAP_SERVICES);
var iotprops = getEnv(env, 'Wearable-');

var querystring = require('querystring');
var https = require('https');
var url = require('url');

exports.getDeviceData = function(req, res) {
    var user = req.body.username;
    var pw = req.body.pw;
    console.log("Username: "+user);
    console.log("Iot app id: "+iotprops.appId);
    console.log("Iot URL: "+iotprops.url);
    queryFitbitData(user, pw, '2014-05-16', updateDataView);
    res.render('iotview');
};

function getEnv(vcapEnv, serviceNameStr) {
    for (var serviceOfferingName in vcapEnv) {
        if (vcapEnv.hasOwnProperty(serviceOfferingName) &&
            serviceOfferingName.indexOf(serviceNameStr) === 0) {
              var serviceBindingData = vcapEnv[serviceOfferingName][0];
              return serviceBindingData.credentials;
        }
    }
}

function updateDataView(respObj) {

}

function queryFitbitData(username, password, datestr, callbackFn) {

  var iotURLObj = url.parse(iotprops.url);
  var host = iotURLObj.host;
  var authStr = username+":"+password;
  var endpoint = "/iot/doc?id=fb_activity_"+datestr+"&appId="+iotprops.appId;

  var options = {
    host: host,
    path: endpoint,
    method: "GET",
    auth: authStr
  };

    var req = https.request(options, function(res) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      console.log(responseString);
      var responseObject = JSON.parse(responseString);
      callbackFn(responseObject);
    });
  });

  req.write(dataString);
  req.end();
}
