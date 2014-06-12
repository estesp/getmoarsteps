
/* HTML5 Demos geo example by @remy, modified for my purposes below.
 * Licensed: https://github.com/remy/html5demos/blob/master/MIT-LICENSE.TXT
 */

function success(position) {
  var s = document.querySelector('#status');

  if (s.className == 'success') {
    // not sure why we're hitting this twice in FF, I think it has to
		// do with a cached result coming back
    return;
  }

  s.innerHTML = "Found.";
  s.className = 'success';

  var mapcanvas = document.createElement('div');
  mapcanvas.id = 'mapcanvas';
  mapcanvas.style.height = '400px';
  mapcanvas.style.width = '400px';

  document.querySelector('article').appendChild(mapcanvas);

	document.getElementById('poslat').value = position.coords.latitude;
	document.getElementById('poslon').value = position.coords.longitude;

  var latlng = new google.maps.LatLng(position.coords.latitude,
																			position.coords.longitude);

  var myOptions = {
    zoom: 15,
    center: latlng,
    mapTypeControl: false,
    navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var map = new google.maps.Map(document.getElementById("mapcanvas"),
																myOptions);

  var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      title: "You are here! (at least within a "+ position.coords.accuracy +
						 " meter radius)"
  });
}

function error(msg) {
  var s = document.querySelector('#status');
  s.innerHTML = typeof msg == 'string' ? msg : "Location lookup failure.";
  s.className = 'fail';
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success, error);
} else {
  error('Location service not supported/authorized.');
}

// Form calls "searchNearMe" to perform ajax call to geolocation services
function searchNearMe() {

	var lat = document.getElementById("poslat").value;
	var lon = document.getElementById("poslon").value;
	var dist = document.getElementById("distance").value;
	var urlStr = "/tbs?poslat=" + lat + "&poslon=" + lon + "&distance=" + dist;
	ajaxCall(urlStr, "GET", function(respData) {
		alert("got an ajax response");
	});

	return false;
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

function ajaxCall(url, method, resultFn) {

	var xhr = createXHR();

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			resultFn(JSON.parse(xhr.responseText));
		}
	};

	xhr.open(method, url, true);
	xhr.send(null);
}
