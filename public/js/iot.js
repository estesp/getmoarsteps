
function success(position) {
  var s = document.querySelector('#status');

  if (s.className == 'success') {
    // not sure why we're hitting this twice in FF, I think it's to do with a cached result coming back
    return;
  }

  s.innerHTML = "found you!";
  s.className = 'success';

  var mapcanvas = document.createElement('div');
  mapcanvas.id = 'mapcanvas';
  mapcanvas.style.height = '400px';
  mapcanvas.style.width = '560px';

  document.querySelector('article').appendChild(mapcanvas);

  var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  var myOptions = {
    zoom: 15,
    center: latlng,
    mapTypeControl: false,
    navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);

  var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      title:"You are here! (at least within a "+position.coords.accuracy+" meter radius)"
  });
}

function error(msg) {
  var s = document.querySelector('#status');
  s.innerHTML = typeof msg == 'string' ? msg : "failed";
  s.className = 'fail';

  // console.log(arguments);
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success, error);
} else {
  error('not supported');
}

function createXHR() {
	if (typeof XMLHttpRequest != 'undefined') {
		return new XMLHttpRequest();
	} else {
		try {
			return new ActiveXObject('Msxml2.XMLHTTP');
		} catch (e1) {
			try {
				return new ActiveXObject('Microsoft.XMLHTTP');
			} catch (e2) {
			}
		}
	}
	return null;
}

function sendRequest(operation) {
	var uname = document.getElementById('username').value;
	if(uname === '') {
		document.getElementById('echo').innerHTML = 'Please input a valid username.';
		document.getElementById('username').focus();
		return;
	}
	var pass = document.getElementById('pw').value;
  if(pass === '') {
	  document.getElementById('echo').innerHTML = 'Please enter a password.';
	  document.getElementById('pw').focus();
	  return;
  }
	document.getElementById('echo').innerHTML = '';

	document.getElementById('iotcredentials').submit();

}

function fred() {
	var xhr = createXHR();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			var result = JSON.parse(xhr.responseText);
			var value = result.value;
			if (operation == "get") {
				if (value === null) {
					document.getElementById('echo').innerHTML = "No entry is found.";
					document.getElementById('username').value = "";
					document.getElementById('pw').value = "";
				} else {
					document.getElementById('pw').value = value;
					document.getElementById('echo').innerHTML = "Get Corresponding entry value successfully.";
				}
			} else {
				if (operation == "delete") {
					document.getElementById('key').value = "";
					document.getElementById('value').value = "";
				}
				document.getElementById('echo').innerHTML = value;
			}
		}
	};

	if (operation == "get") {
		xhr.open("GET", "cache/" + key, true);
		xhr.send(null);
	} else if (operation == "put") {
		xhr.open("PUT", "cache?key=" + key + "&value=" + value, true);
		xhr.send(null);
	} else {
		xhr.open("DELETE", "cache/" + key, true);
		xhr.send(null);
	}
}

function getDevice() {
	sendRequest('get');
}
