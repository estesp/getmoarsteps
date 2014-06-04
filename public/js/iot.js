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
