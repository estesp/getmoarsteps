var env = JSON.parse(process.env.VCAP_SERVICES);
var iotprops = {};

exports.getDeviceData = function(req, res) {
    var user = req.body.username;
    var pw = req.body.pw;
    var tzoffset = -(req.body.tzoffset);

    getCredentials(env, 'Wearable');

    queryFitbitData(user, pw, currentDateToYMDForm(tzoffset),
                    function(respData) {
                      res.render('iotview', respData);
                    });

};

function currentDateToYMDForm(tzOffset) {

    //get the server's offset in hours
    var tmpDateObj = new Date();
    var srvOffset = tmpDateObj.getTimezoneOffset()/60;
    //to get local client time take the client's offset + server's offset
    var actualOff = tzOffset+srvOffset;
    //now get the actual date by getting time in ms and adding the offset ms
    var dateObj = new Date( new Date().getTime() + (actualOff * 3600 * 1000));
    console.log(''+dateObj);

    //IoT API wants YYYY-MM-DD; generate that from the date obj
    var day = dateObj.getDate();
    var mon = dateObj.getMonth() + 1;
    var year = dateObj.getFullYear();
    return '' + year + '-' +
           (mon <= 9 ? '0' + mon : mon) + '-' +
           (day <= 9 ? '0' + day : day);
}

function getCredentials(vcapEnv, serviceNameStr) {

    vcapEnv['user-provided'].forEach(function(service) {
      if (service.name.indexOf(serviceNameStr) === 0) {
          iotprops = service.credentials;
      }
    });
}

function queryFitbitData(username, password, datestr, callbackFn) {

    var https = require('https');
    var url = require('url');

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
    console.log("URL: "+host+" / Endpoint: "+endpoint);

    //send the request to the IoT API
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

    req.write(""); //method == GET, no data
    req.end();
}
