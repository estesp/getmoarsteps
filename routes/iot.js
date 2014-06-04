
var env = JSON.parse(process.env.VCAP_SERVICES);
var iotprops = getEnv(env, 'Wearable-');

exports.getDevice = function(req, res) {
    var user = req.body.username;
    var pw = req.body.pw;
    console.log("Username: "+user);
    
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
