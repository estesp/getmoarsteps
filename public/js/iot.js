
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
  mapcanvas.style.width = '480px';

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

  //explicitly not using "var" because we want to access the map later
  map = new google.maps.Map(document.getElementById("mapcanvas"),
																myOptions);

  var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      title: "You are here! (at least within a "+ position.coords.accuracy +
						 " meter radius)"
  });

  //show the search capability since location was successful
  document.getElementById('div-near-1').style.display = 'block';
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
  //put up throbber to notify searching
  document.getElementById('throbber-div-1').style.display = 'block';
  document.getElementById('search-results').style.display = 'none';

	ajaxCall(urlStr, "GET", function(respData) {

    document.getElementById('search-results').style.display = 'block';

    document.getElementById('throbber-div-1').style.display = 'none';

    var resultsDiv = document.getElementById("search-results");
    if (respData.resultsCount === 0) {
      resultsDiv.innerHTML = "<div class='no-results'>"+
            "I'm sorry, we couldn't find any parks within your travel time"+
            " selection.  Please change your selections and try again.</div>";
    } else {
      //output the result entry to the web page
      // placeEntry.distance == distance from orig lat/lon
      // placeEntry.fields.name == official name
      // placeEntry.fields.{lat,lng} == latitude and longitude
      // placeEntry.fields.address == street address (may not exist)
      // placeEntry.city == city name
      // placeEntry.state == 2-letter state code
      //mustache.js template for search results
      var gmapLink = "<a target='_new' class='mapLink' href="+
                      "'https://www.google.com/maps?saddr=My+Location&daddr=";

      var resultTmpl = "{{#searchResults}}\n<tr class='resultRow'>" +
              "<td class='placeName'>"+gmapLink+"{{fields.lat}},{{fields.lng}}"+
              "'>{{fields.name}}</a></td>\n" +
              "<td class='placeDetails'>{{fields.address}}<br/>"+
              "{{fields.city}}, {{fields.state}}</td></tr>\n"+
              "{{/searchResults}}";

      var htmlOut = Mustache.render(resultTmpl, respData);
      var htmlStart = "<table class='searchResults'>";

      resultsDiv.innerHTML = htmlStart+htmlOut+"</table>";

      //also add markers on the map for each result
      respData.searchResults.forEach(function(placeEntry) {

        //create the marker and then expand the current map view
        //to make it visible
        var latlng = new google.maps.LatLng(placeEntry.fields.lat,
                                            placeEntry.fields.lng);
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: placeEntry.fields.name,
            icon: {
              url: "/images/park-map-marker.png",
              scaledSize: new google.maps.Size(48,48)
            }
        });
        var curBounds = map.getBounds();
        curBounds = curBounds.extend(latlng);
        map.fitBounds(curBounds);

        var htmlContent = "<div class='infobox'>" +
                "<span class='placeName'>"+placeEntry.fields.name+"</span>"+
                "<br/>"+
                gmapLink+placeEntry.fields.lat+","+placeEntry.fields.lng+"'>"+
                "[click for directions]</a>"+
                "</div>";

        var infoWindow = new google.maps.InfoWindow({
          content: htmlContent
        });

        google.maps.event.addListener(marker, 'click', function() {
          infoWindow.open(map, marker);
        });
      });
    }
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
