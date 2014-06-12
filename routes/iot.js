//BlueMix hands us our service connection data in the VCAP_SERVICES variable
var env = JSON.parse(process.env.VCAP_SERVICES);
var iotprops = {};

//When the login page POSTs, we get the Wearable API auth info and the client
//browser timezone - caveat is that a user in a different tz than the FitBit
//will not get fully appropriate results based on time of day, although the
//FitBit data itself *will* be correct, just our app assumptions will be wrong
exports.getDeviceData = function(req, res) {
    var user = req.body.username;
    var pw = req.body.pw;
    var tzoffset = -(req.body.tzoffset);

    //look at the VCAP_SERVICES variable and grab the credentials for the
    //Wearable IoT service
    getCredentials(env, 'Wearable');

    var curDateTime = getClientCurrentDateTime(tzoffset);

    //calculate the percentage of "today" that is gone for our status page
    var percentOfDay = curDateTime.getHours()*60 + curDateTime.getMinutes();
    percentOfDay = percentOfDay / (24*60) * 100;

    //call the Wearable API for today's data, and then render the response page
    queryFitbitData(user, pw, currentDateToYMDForm(curDateTime),
                    function(respData) {
                      respData["daypercent"] = percentOfDay;
                      res.render('iotview', respData);
                    });

};

function getClientCurrentDateTime(tzOffset) {
    //get the server's offset in hours
    var tmpDateObj = new Date();
    var srvOffset = tmpDateObj.getTimezoneOffset()/60;
    //to get local client time take the client's offset + server's offset
    var actualOff = tzOffset+srvOffset;
    //now get the actual date by getting time in ms and adding the offset ms
    var dateObj = new Date( new Date().getTime() + (actualOff * 3600 * 1000));
    return dateObj;
}

function currentDateToYMDForm(dateObj) {

    //IoT API wants YYYY-MM-DD; generate that from the date obj
    var day = dateObj.getDate();
    var mon = dateObj.getMonth() + 1;
    var year = dateObj.getFullYear();
    return '' + year + '-' +
           (mon <= 9 ? '0' + mon : mon) + '-' +
           (day <= 9 ? '0' + day : day);
}

function queryFitbitData(username, password, datestr, callbackFn) {

    var restcall = require('../restcall');
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
    restcall.get(options, true, callbackFn);
}

function getCredentials(vcapEnv, serviceNameStr) {

    vcapEnv['user-provided'].forEach(function(service) {
      if (service.name.indexOf(serviceNameStr) === 0) {
          iotprops = service.credentials;
      }
    });
}
