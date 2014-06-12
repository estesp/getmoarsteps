var env = JSON.parse(process.env.VCAP_SERVICES);
var tbsprops = {};

var restcall = require('../restcall');

exports.travelBoundary = function(req, res) {
    var dist = req.query.distance;
    var lat = req.query.poslat;
    var lon = req.query.poslon;

    console.log("GET /tbs: "+dist+" Lat: "+lat+", Lon: "+lon);
    getCredentials(env, 'TravelBoundary');

    queryBoundaryData(dist, lat, lon, function(polygonData) {
      //now use the polygon response to search MapQuest Polygon search API
      findParksInPolygon(polygonData, function(resultData) {
        res.send(resultData);
      });
    });
};

function getCredentials(vcapEnv, serviceNameStr) {

    vcapEnv['user-provided'].forEach(function(service) {
      if (service.name.indexOf(serviceNameStr) === 0) {
          tbsprops = service.credentials;
      }
    });
}

function queryBoundaryData(distance, lat, lon, callbackFn) {

    var url = require('url');

    var iotURLObj = url.parse(tbsprops.url);
    var host = iotURLObj.host;
    var endpoint = iotURLObj.pathname;
    endpoint += "?latitude=" + lat + "&longitude=" + lon +
                "&cost=" + distance + "&units=Minutes&appId="+tbsprops.appId;

    var options = {
      host: host,
      path: endpoint,
      method: "GET",
      rejectUnauthorized: false
    };
    console.log("URL: "+host+" / Endpoint: "+endpoint);

    //send the request to the Travel Boundary Service API
    restcall.get(options, true, callbackFn);
}

function findParksInPolygon(polygonData, callbackFn) {

    var mq_appKey = "Fmjtd%7Cluur2g61n0%2C2s%3Do5-9aznuf";
    var host = "www.mapquestapi.com";
    var searchParksOnly = "&hostedData=mqap.ntpois|group_sic_code=?|799951"
    var endpoint = "/search/v2/polygon?key="+mq_appKey+searchParksOnly;
    endpoint += "&polygon=";

    var polygonResult = polygonData.Output.IsoPolygonResponse.Polygon[0];
    (polygonResult.Exterior.LineString[0].Pos).forEach(function (point) {
      endpoint += ""+point.Y+","+point.X+",";
    });
    //trim the ending comma
    endpoint.replace(/\,$/,"");

    var options = {
      host: host,
      path: endpoint,
      method: "GET"
    };

    console.log("URL: "+host+" / Endpoint: "+endpoint);

    //send the request to the MapQuest Polygon Search API
    restcall.get(options, false, callbackFn);
}
